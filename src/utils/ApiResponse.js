class ApiResponse{
    constructor(statuscode="",data,message="succes"){
        this.statuscode=statuscode<400;
        this.data=data;
        this.message=message;
        
    }
}
export{ApiResponse}