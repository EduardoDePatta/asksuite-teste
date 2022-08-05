const puppeteer = require("puppeteer");
const express = require("express");
const server = express();

const url = "https://pratagy.letsbook.com.br/D/Reserva?checkin=04%2F08%2F2022&checkout=08%2F08%2F2022&cidade=&hotel=12&adultos=2&criancas=&destino=Pratagy+Beach+Resort+All+Inclusive&promocode=&tarifa=&mesCalendario=6%2F14%2F2022";

//modificar a data de checkin e checkout para o período escolhido
const checkin = '12/08/2022';
const checkout = '15/08/2022';

server.get("/", async (request, response) => {
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('iniciei');

  await page.goto(url);
  console.log('estou na url');
  await page.waitForTimeout(2000);

  await page.type('#var-busca-chegada', checkin);
  await page.type('#var-busca-partida', checkout);

  await Promise.all([        
    page.click('#btnModificarBusca'),
    console.log('cliquei no botão')
])

    //Busca pelos nomes dos quartos
    await page.waitForTimeout(2000);
    const names = await page.$$eval('.quartoNome', el => el.map(name => name.innerText));
    console.log('busquei os nomes com sucesso');
    
    //busca pela descrição dos quartos  
    await page.waitForTimeout(2000);
    const descriptions = await page.$$eval('.quartoDescricao', el2 => el2.map(description => description.innerText));
    console.log('busquei as descrições com sucesso');
 
    //busca pelo preço dos quartos
    await page.waitForTimeout(2000);
    const prices = await page.$$eval('.valorFinal.valorFinalDiscounted', el3 => el3.map(price => price.innerText));
    console.log('busquei os preços com sucesso');
 
    //busca pelas imagens dos quartos
    await page.waitForTimeout(2000);
    const images = await page.$$eval('.room--image', el4 => el4.map(image => image.getAttribute('data-src'))); 
    console.log('busquei as imagens com sucesso');  
    
    const rooms = [];
 
    for (let i =0; i< names.length; i++){
        rooms[i] =
            {
                "name":names[i],
                "description":descriptions[i],
                "price":prices[i],
                "image":images[i]
            }               
    };

    console.log(rooms);
    response.send({ rooms });

    await page.waitForTimeout(3000);
    await browser.close();

});


const port = 8080;
server.listen(port, () => {
  console.log(`Sucesso... acesse em http://localhost:${port}`);
});
