
module.exports = ()=>{
    console.log('hello from export')
};


//export object
module.exports = {
    //prop
    value : 'valueOne',
    //array
    userId : [1,2,3],
    //function
    action() {
        console.log('action');
    },
}