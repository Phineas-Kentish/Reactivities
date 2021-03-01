import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../../..";
import { User, UserFormValues } from "../../models/user"
import agent from "../agent";
import { store } from "./Store";

export default class UserStore {
    user: User | null = null;

    constructor () {
        makeAutoObservable(this)
    }

    get isLoggedIn(){
        return !!this.user
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds)
            store.commonStore.setToken(user.token)
            runInAction(() => this.user = user)
            history.push("/activities")
            console.log(user)
            store.modalStore.closeModal()
        } catch (error) {
            throw error
        }
    }    

    logout = () => {
        store.commonStore.setToken(null)
        window.localStorage.removeItem("jwt")
        this.user = null
        history.push("/")
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds)
            store.commonStore.setToken(user.token)
            runInAction(() => this.user = user)
            history.push("/activities")
            console.log(user)
            store.modalStore.closeModal()
        } catch (error) {
            throw error
        }
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current()
            runInAction(() => this.user = user)
        } catch (error) {
            console.log(error)
        }
    }
}