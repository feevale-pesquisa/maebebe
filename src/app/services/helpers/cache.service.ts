import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import sha256 from 'crypto-js/sha256';

export enum CacheType {
    OUTRO = 'O',
    MAE = 'M',
    BEBE = 'B',
    GESTACAO = 'G',
    LISTA_MAE = 'LM',
    LISTA_BEBE = 'LB',
    LISTA_GESTACAO = 'LG',
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

    private async tryAgain(callback: Function, numberOfAttempts = 3, attempt = 1)
    {
        if(attempt > numberOfAttempts) //Caso exceda o número de tentativas encerra o método
            return;

        if(this.locked) {
            await this.sleep(50 * attempt) //Aguarda x ms
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
    
    public async add(id: string, item: object, type: CacheType = CacheType.OUTRO, lifetimeInMinutes: number = 1)
    {
        let key = sha256(id + type)

        let expireIn = moment().add(lifetimeInMinutes, 'minutes')

        let cache = {
            id: id,
            data: item,
            type: type
        }

        await this.addToIndex(String(key), type, expireIn)
        await this.storage.set('cache.' + key, cache)
    }

    public async has(id: string, type: CacheType)
    {
        let key = sha256(id + type)
        let result = await this.storage.get('cache.' + key)

        return result != null
    }

    public async getById(id: string, type: CacheType)
    {
        let key = sha256(id + type)
        let result = await this.storage.get('cache.' + key)
        return result.data
    }

    public async getByKey(key: string)
    {
        let result = await this.storage.get('cache.' + key)
        return result.data
    }

    public async getByType(type: CacheType)
    {
        let list = []
        let cacheIndex:any = await this.getCacheIndex()

        for (const key in cacheIndex) {
            if(cacheIndex[key].type == type.valueOf())
                list.push(await this.getByKey(key))
        }

        return list
    }

    public async remove(key: string)
    {
        await this.removeFromIndex(String(key))
        await this.storage.remove('cache.' + key)
    }

    public async sincronize()
    {
        let cacheIndex:any = await this.getCacheIndex()

        for (const key in cacheIndex) {
            let expire:moment.Moment = moment(cacheIndex[key].expire_in)

            if(expire.isBefore(moment())) {
                console.log(key)
                await this.remove(key)
            }
        }
    }

    public async schedule()
    {
        await this.sincronize()

        setInterval(async () => {
            await this.sincronize()
        }, 10000)
    }
}