const whiteList=[
    'http://localhost:3000',
    'http://localhost:3001'
    

];

export const corsOptions ={
    origin:(origin,callback)=>{
        if(!origin || whiteList.includes(origin)){
            callback(null,true);

        }else{
            callback (new Error('not allowed by cors'));
        }
    },
    credentials:true,
    optionsSuccessStatus: 200,
}