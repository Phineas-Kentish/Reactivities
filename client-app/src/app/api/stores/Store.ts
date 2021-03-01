import { createContext, useContext } from "react";
import ActivityStore from "./ActivityStore";
import CommonStore from "./commonStore";
import ModalStore from "./ModalStore";
import UserStore from "./UserStore";

interface Store {
    activityStore: ActivityStore   
    commonStore: CommonStore
    userStore: UserStore
    modalStore: ModalStore
}

// Here you add individual stores to the global Store
export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
}

// Here you create React Context with you entire Store
export const StoreContext = createContext(store)

// Last we export it 
export function useStore() {
    return useContext(StoreContext)
}