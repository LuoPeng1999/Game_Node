module.exports = function main(arr,pid=0){
    const temp = [];
    for(const item of arr){
        if(item.pid == pid && item.isShow ){
            item.children = main(arr,item.id);
            temp.push(item);
        }
    }
    return temp;
}