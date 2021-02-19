import { createContext, useContext } from "react";
import ActivityStore from "./ActivityStore";

interface Store {
    activityStore: ActivityStore    
}

// Here you add individual stores to the global Store
export const store: Store = {
    activityStore: new ActivityStore()
}

// Here you create React Context with you entire Store
export const StoreContext = createContext(store)

// Last we export it 
export function useStore() {
    return useContext(StoreContext)
}