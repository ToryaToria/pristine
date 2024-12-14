const orderForm = document.querySelector('.form');

// чтобы Pristine НЕ валидировала форму по мере ввода, третий аргумент - false.
const pristine = new Pristine(orderForm, {
  classTo: 'form__item', // Элемент, на который будут добавляться классы
  errorClass: 'form__item--invalid', // Класс, обозначающий невалидное поле
  successClass: 'form__item--valid', // Класс, обозначающий валидное поле
  errorTextParent: 'form__item', // Элемент, куда будет выводиться текст с ошибкой
  errorTextTag: 'span', // Тег, который будет обрамлять текст ошибки
  errorTextClass: 'form__error' // Класс для элемента с текстом ошибки
}, false);


// функция проверки длины поля name
function validateNickname (value) {
  return value.length >= 2 && value.length <= 50;
}

// проверка поля "имя"
pristine.addValidator(
  orderForm.querySelector('#nickname'),
  validateNickname,
  'От 2 до 50 символов'
);


// УСЛОВИЯ

// Максимальное количество зависит от размера упаковки:
// S-размер - 10 штук, M-размер - 5 штук в одни руки
const amountField = orderForm.querySelector('#amount');
const maxAmount = {
  's': 10,
  'm': 5
};

//найти выбранный на текущий момент размер — переменная unit — после по размеру достать максимально возможное количество из maxAmount, и только потом сравнить со значением в поле.
function validateAmount (value) {
  const unit = orderForm.querySelector('[name="unit"]:checked');
  return value.length && parseInt(value) <= maxAmount[unit.value];
}

//вместо простой строчки с текстом - функция, генерирующая текст 
function getAmountErrorMessage () {
  const unit = orderForm.querySelector('[name="unit"]:checked');
  return `Не больше ${maxAmount[unit.value]} штук в одни руки`;
}

pristine.addValidator(amountField, validateAmount, getAmountErrorMessage);

// проверка количества в момент выбора другого размера. Это удобно, когда пользователь сперва ввёл количество, а потом решил изменить размер.
function onUnitChange () {
  amountField.placeholder = maxAmount[this.value];
  pristine.validate(amountField);
}

orderForm.querySelectorAll('[name="unit"]').forEach((item) => item.addEventListener('change', onUnitChange));

// Доставка возможна на следующий день или на выходных
// Самовывоз в этот же день, либо на следующий
// проверка сопоставления типа доставки с датой. Использоуется подход с соотношением: ключами в объекте deliveryOption будут типы доставки, а значениями — массивы с возможными датами.
const deliveryField = orderForm.querySelector('[name="delivery"]');
const dateField = orderForm.querySelector('[name="date"]');
const deliveryOption = {
  'Доставка': ['Завтра', 'На выходных'],
  'Самовывоз': ['Сегодня', 'Завтра']
};

//функция проверки: если по выбранному типу доставки есть выбранный день — Ок. иначе — ошибка.
function validateDelivery () {
  return deliveryOption[deliveryField.value].includes(dateField.value);
}

//функция с текстом ошибки: построили на данных разметки и просклоняли.
function getDeliveryErrorMessage () {
  return `
    ${deliveryField.value}
    ${dateField.value.toLowerCase()}
    ${deliveryField.value === 'Доставка' ? 'невозможна' : 'невозможен'}
  `;
}

//проверка вызывается на обоих выпадающих списках, не важно, что первым выбрал пользователь.
pristine.addValidator(deliveryField, validateDelivery, getDeliveryErrorMessage);
pristine.addValidator(dateField, validateDelivery, getDeliveryErrorMessage);

// событие вешается на форму при отправке
orderForm.addEventListener('submit', (evt) => {
  
  // отменить действие по умолчанию
  evt.preventDefault();
  // запустить пристин
  pristine.validate();
});
