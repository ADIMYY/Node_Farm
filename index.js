const fs = require('fs');
const http = require('http');
const url = require('url');


//================================================================================================================================
//                        SERVER

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description,);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    
    return output;
}

const temOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const temCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const temProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);

    // Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'content-type' : 'text/html'});
        const htmlCard = dataObject.map(el => replaceTemplate(temCard, el)).join('');
        const output = temOverview.replace('{%PRODUCT_CARDS%}', htmlCard);
        res.end(output);

    // Product Page
    } else if (pathname === '/product') {
        res.writeHead(200, {'content-type' : 'text/html'});
        const product = dataObject[query.id];
        const output = replaceTemplate(temProduct, product);
        res.end(output);

    // Api
    } else if(pathname === '/api') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(data);
    

    // Not Found
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>page not found !</h1>');
    }
});



server.listen(8000, '127.0.0.1', () => {
    console.log('server listening on port 8000');
});



//================================================================================================================================