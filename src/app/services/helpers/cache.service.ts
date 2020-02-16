import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

export enum CacheType {
    OUTRO = 'O',
    MAE = 'mae',
    BEBE = 'bebe',
    GESTACAO = 'gestacao',
    LISTA_MAE = 'lista-mae',
    LISTA_BEBE = 'lista-bebe',
    LISTA_GESTACAO = 'lista-gestacao',
    CADASTRO_MAE = 'cadastro-mae',
    CADASTRO_BEBE = 'cadastro-bebe',
    CADASTRO_GESTACAO = 'cadastro-gestacao',
}

@Injectable({
    providedIn: 'root'
})
export class CacheService {

    private locked:boolean = false;

    public constructor(private storage: Storage)
    {
        
    }

    private sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    private async tryAgain(callback: Function, numberOfAttempts = 50, attempt = 1)
    {
        if(attempt > numberOfAttempts) //Caso exceda o número de tentativas encerra o método
            return;

        if(this.locked) {
            console.log("Tentando novamente")
            await this.sleep(30 * attempt) //Aguarda x ms
            await this.tryAgain(callback, attempt + 1) //Chamada recursiva para tentar novamente 'callback'
        } else {
            await callback(); //Executa a chamada propriamente dita, adicionando ou removendo do index
        }
    }

    private async addToIndex(key: string, type: CacheType = CacheType.OUTRO, expireIn: moment.Moment)
    {
        //Caso alguém também esteja chamando esse método, para não ocorrer problemas de concorrência
        if(this.locked) { 
            //Tenta novamente algumas vezes até que não esteja mais bloqueado
            this.tryAgain(() => { this.addToIndex(key, type, expireIn) })
            return
        }

        this.locked = true

        let cacheIndex:any = await this.getCacheIndex()

        cacheIndex[key] = { type: type, expire_in: expireIn.valueOf() }

        await this.storage.set('cache.index', cacheIndex)

        this.locked = false
    }

    private async removeFromIndex(key: string)
    {
        if(this.locked) {
            this.tryAgain(() => { this.removeFromIndex(key) })
            return
        }

        this.locked = true

        let cacheIndex:any = await this.getCacheIndex()

        delete cacheIndex[key];

        await this.storage.set('cache.index', cacheIndex)

        this.locked = false
    }

    private async getCacheIndex()
    {
        let cacheIndex:any = await this.storage.get('cache.index')

        if(!cacheIndex)
            cacheIndex = []

        return cacheIndex;
    }
    
    public async add(id: any, item: object, type: CacheType = CacheType.OUTRO, lifetimeInMinutes: number = 1)
    {
        let key:string = String(type) + '.' + String(id)
        console.debug('[cache.service.ts] - Adicionando ' + key + ' no cache')

        let expireIn = moment().add(lifetimeInMinutes, 'minutes')

        let cache = {
            id: id,
            data: item,
            type: type
        }

        await this.addToIndex(String(key), type, expireIn)
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
        let result = await this.storage.get('cache.' + key)

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
        await this.removeFromIndex(String(key))
        await this.storage.remove('cache.' + key)
    }

    public async sincronize()
    {
        let cacheIndex:any = await this.getCacheIndex()

        for (let key in cacheIndex) {
            let expire:moment.Moment = moment(cacheIndex[key].expire_in)

            if(expire.isBefore(moment())) {
                console.debug('[cache.service.ts] - ' + key + ' está vencido')
                await this.remove(key)
            }
        }
    }

    public async schedule(number = 1)
    {
        await this.sincronize()

        setTimeout(async () => {
            await this.sincronize()
            this.schedule(number + 1)
        }, 10000)
    }
}