const fs = require('fs');
const http = require('http');
const url = require('url');
const { type } = require('os');
// // blocking synchronus
const textIn = fs.readFileSync('./text/input.txt','utf-8');
console.log(textIn);

const textOut = `Me Said = ${textIn}\nOn ${Date.now()}`;
fs.writeFileSync('./text/output.txt', textOut);
console.log('File was be written');

//Non Blocking Async
fs.readFile('./text/asyncOne.txt','utf-8',(err,data) => {
    console.log(data);
    fs.readFile('./text/asyncTwo.txt','utf-8',(err,data1) => {
        console.log(data1);
        fs.writeFile('./text/Merge.txt',`Merge = ${data}, ${data1}`,'utf-8',() => {
            console.log("your file has be written");
        })
    });
})
console.log('File Was Be Written');

// SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    //output = output.replace(/{%ORGANIC%}/g, product.organic);
    if(!product.organic)output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-cards.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-products.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
   
const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(url.parse(req.url));
    //const pathName = req.url;
    const {query, pathname} = url.parse(req.url,true);
    

    // Overview Page
    if(pathname == '/' || pathname == '/overview') {
        //res.end("Overview Page");
        res.writeHead(200, {
            'Content-type' : 'text/html'
        });
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el));
        console.log(cardsHtml);
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        // res.end(tempOverview);
        res.end(output);
    //Product Page    
    } else if (pathname === '/product') {
        //res.end("Product Page");
        res.writeHead(200,{'Content-type' : 'text/html'});
         const product = dataObj[query.id];
         const output = replaceTemplate(tempProduct, product);
        //res.end(tempProduct);
        res.end(output);
    // Api Page
    } else if (pathname === '/api') {
        // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err,data) => {
        //     res.writeHead(200, {
        //         'Content-type' : 'application/json'
        //     });
        //     console.log(JSON.parse(data));
        //     res.end(data)
        // })
        //restructure
        res.writeHead(200, {
            'Content-type' : 'application/json'
        });
        res.end(data);
    }else {
        //404 page
        res.writeHead(404, {
            'Content-type': 'text/html',
        });
        res.end('<h1>Page Not Found</h1>');
    }
    // res.end("Hello from server");
});

server.listen(3000,'127.0.0.1', () =>{
    console.log('Listening to Request on port 8000')
})

