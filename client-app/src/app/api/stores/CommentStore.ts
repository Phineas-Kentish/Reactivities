import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../../models/Comments";
import { store } from "./Store";

export default class CommentStore {
    comments: ChatComment[] = []
    hubConnection: HubConnection | null = null

    constructor() {
        makeAutoObservable(this)
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(process.env.REACT_APP_CHAT_URL + '?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection?.start().catch(error => console.log("Error stopping SignalR", error))

            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
                runInAction(() => {                                     
                    comments.forEach(comment => {                        
                        comment.createdAt = new Date(comment.createdAt)                        
                    })
                    this.comments = comments
                })
            })

            this.hubConnection.on("ReceiveComment", (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt)
                    this.comments.unshift(comment)
                })
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log("Error stopping SignalR", error))
    }

    clearComments = () => {
        this.comments = []
        this.stopHubConnection()
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id
        try {
            // This will call a method on the server: ChatHub.SendComment
            await this.hubConnection?.invoke("SendComment", values)
        }catch(error){
            console.log(error)
        }

    }
}