const whiteList=['http://localhost:3000'];

export const corsOptions ={
    origin:(origin,callback)=>{
        if(whiteList.indexOf(origin)!==-1 || !origin){
            callback(null,true);

        }else{
            callback (new Error('not allowed by cors'));
        }
    },
    credentials:true,
    optionsSuccessStatus: 200,
}