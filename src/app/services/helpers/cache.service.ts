import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

export enum CacheType {
    OUTRO = 'O',
    MAE = 'mae',
    BEBE = 'bebe',
    GESTACAO = 'gestacao',
    ACOMPANHAMENTO_BEBE = 'acompanhamento-bebe',
    LISTA_MAE = 'lista-mae',
    LISTA_BEBE = 'lista-bebe',
    LISTA_GESTACAO = 'lista-gestacao',
    LISTA_ACOMPANHAMENTO_BEBE = 'lista-acompanhamento-bebe',
    CADASTRO_MAE = 'cadastro-mae',
    CADASTRO_BEBE = 'cadastro-bebe',
    CADASTRO_GESTACAO = 'cadastro-gestacao',
    CADASTRO_ACOMPANHAMENTO_BEBE = 'cadastro-acompanhamento-bebe',
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    private locked:boolean = false;

    public constructor(private storage: Storage)
    {
        
    }

    private async getCacheIndex()
    {
        let cacheIndex:any = await this.storage.get('cache.index')

        let index = (await this.storage.keys())
                        .filter(key => { return key.includes("cache.") })
                        .map(key => { return key.replace("cache.", "") })
        
        let cache = []

        for (const item of index) {
            cache[item] = {
                type : item.split(".", 1)[0]
            }
        }
        return cache
    }
    
    public async add(id: any, item: object, type: CacheType = CacheType.OUTRO, lifetimeInMinutes: number = 1)
    {
        let key:string = String(type) + '.' + String(id)
        console.debug('[cache.service.ts] - Adicionando ' + key + ' no cache')

        let expireIn = moment().add(lifetimeInMinutes, 'minutes')

        let cache = {
            id: id,
            data: item,
            type: type,
            expireIn: expireIn.valueOf()
        }

        await this.storage.set('cache.' + key, cache)

        return key
    }

    public async has(id: any, type: CacheType)
    {
        let key = type + '.' + id
        let result = await this.storage.get('cache.' + key)

        return result != null
    }

    public async getById(id: any, type: CacheType)
    {
        let key = type + '.' + id
        let result = await this.storage.get('cache.' + key)
        return result.data
    }

    public async getByKey(key: string)
    {
        let result = await this.storage.get('cache.' + String(key))

        if(result)
            return result.data
    }

    public async getByType(type: CacheType)
    {
        let list = []
        let cacheIndex:any = await this.getCacheIndex()

        for (let key in cacheIndex) {
            
            if(cacheIndex[key].type == type.valueOf()) {
                let item = await this.getByKey(key)

                if(item)
                    list.push(item)
            }

        }

        return list
    }

    public async removeById(id: string, type: CacheType)
    {
        let key = type + '.' + id
        
        this.remove(key)
    }

    public async remove(key: string)
    {
        console.debug('[cache.service.ts] - Removendo ' + key + ' do cache')

        await this.storage.remove('cache.' + key)
    }

    public async sincronize()
    {
        let cacheIndex:any = await this.getCacheIndex()

        for (let key in cacheIndex) {
            let item = await this.storage.get(key)

            if(!item || typeof item != 'object')
                continue

            if(item.expireIn == undefined) {
                await this.remove(key)
                continue
            }

            let expire:moment.Moment = moment(item.expireIn)

            if(expire.isBefore(moment())) {
                await this.remove(key)
            }
        }
    }

    public async schedule(number = 1)
    {
        setTimeout(async () => {
            await this.sincronize()
            this.schedule(number + 1)
        }, 10000)
    }
}