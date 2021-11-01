module.exports = function tree(data,pid=0,level=0,arr=[]){
    level++;//级别

    for(var i = 0;i <data.length;i++){
        if(data[i].pid == pid && data[i].isShow){
            data[i].level = level;//级别
            arr.push(data[i]);
            tree(data,data[i].id,level,arr)
        }
    }
    return arr;
}