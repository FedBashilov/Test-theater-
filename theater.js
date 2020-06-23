function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Счет для ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("ru-RU", {
    style: "currency", currency: "RUB", minimumFractionDigits: 2
  }).format;
  let comedyCounter = 0;

  for (let perf of invoice.performances) {
    //Проверка названия произведения
    const play = plays[perf.playlD];
    if(!play){
      throw new Error(`неизвестное произведение: ${perf.playlD}`);
    }

    let thisAmount = 0;
    switch (play.type) {
      case "tragedy":
        thisAmount += getTragedyPrice(perf.audience);
        break;
      case "comedy":
        comedyCounter++;
        thisAmount += getComedyPrice(perf.audience);
        break;
      default:
        throw new Error(`неизвестный тип: ${play.type}`);
    }

    volumeCredits += getCommonCredits(perf.audience);
    // Вывод строки счета
    result += `${perf.playlD}: ${format(thisAmount / 100)} (${perf.audience} мест)\n`;
    totalAmount += thisAmount;
  }

  volumeCredits += getComedyCredits(comedyCounter);

  result += `Итого с вас $(format(totalAmount/100)}\n`;
  result += `Вы заработали ${volumeCredits} бонусов\n`;
  return result;
}

function getTragedyPrice(audience) {
  let price = 40000;
  if (audience > 30) {
    price += 1000 * (audience - 30);
  }
  return price;
}

function getComedyPrice(audience) {
  let price = 30000;
  price += 300 * audience;
  if (audience > 20) {
    price += 10000 + 500 * (audience - 20);
  }
  return price;
}

function getCommonCredits(audience) {
  let credits = 0;
  //Бонус, если больше 30 зрителей
  if (audience > 30) {
    credits += audience - 30;
  }
  return credits;
}

function getComedyCredits(comedyCounter) {
  let credits = 0;
  // Дополнительный бонус за каждые 10 комедий
  credits += math.floor(comedyCounter / 10);
  return credits;
}
