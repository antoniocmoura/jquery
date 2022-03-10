$(document).ready(function () {

   let validationList = [];

   // simula a consulta dos produtos numa API
   let produtos = getProdutosAPI();

   // monta a listagem de produtos dinamicamente
   $(produtos).each(function (index, element) {
      let preco = element.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
      let $div = $('<div/>')
         .attr('class', 'featured-item')
         .html(`<img src="${element.imagem}" alt="Item ${element.id}">` +
            `<h4>${element.descricao}</h4>` +
            `<h6>${preco}</h6>` +
            `<a href="single-product.html" class="btn btn-dark stretch-link">Comprar</a>`
         );
      $('#product_list').append($div);
   });

   $('.owl-carousel').owlCarousel();

   $('.featured-item a').on('click', function (event) {
      event.preventDefault();
      alert('Adicionado ao carrinho');
   })

   /*
    * Ouvinte de eventos .nav-modal-open
    */
   let myModal = new bootstrap.Modal($('#modelId'));

   $('.nav-modal-open').on('click', function (e) {
      e.preventDefault();
      validationList = [];
      let elem = $(this).attr('rel');
      $('.modal-body').html($('#' + elem).html());
      $('.modal-header h5.modal-title').html($(this).text());
      myModal.show();
   })

   /*
   * Submit do contato
   */
   $('body').on('submit', '#form-contato', function (e) {
      e.preventDefault();
      let formValidated = true;
      for (index in validationList) {
         let input = $('#' + validationList[index]);
         if (!validate(input)) {
            formValidated = false;
         }
      }
      if (formValidated) {
         alert('Contato enviado com sucesso!');
         myModal.hide();
      }
   })

   /*
    * Submit da inscrição por e-mail
    */
   $('body').on('submit', '#subscribe', function (e) {
      e.preventDefault();
      const inputEmail = $('#email-subscribe');
      if (validate(inputEmail)) {
         alert('Inscrição realizada com sucesso!');
         $("#email-subscribe").val('');
      }
   })

   /*
    * Configuração dos campos do formulário de contato
    */
   $('body').on('focus', '#form-contato', function () {
      if (validationList.length === 0) {
         addValidation('nome');
         addValidation('email');
         addValidation('date', '00/00/0000');
         addValidation('time', '00:00');
         addValidation('cep', '00000-000');
         addValidation('phone', '(00)00000-0000');
         addValidation('cpf', '000.000.000-00');
      }
   })

   function addValidation(inputID, mask) {
      validationList.push(inputID);
      const input = $('#' + inputID);
      if (mask) {
         input.mask(mask);
         if (mask === '00/00/0000') {
            input.datepicker($.datepicker.regional["pt-BR"]);
            input.on('focus', function () {
               input.datepicker('show');
            });
         }
      }
      input.on('focusout change', function (event) {
         event.preventDefault();
         validate(input);
      });
   }

   /*
   * Validação   
   */
   function validate(input) {
      if ((input.val() == '') ||
         ((input.hasClass('validateName')) && (!validateName(input))) ||
         ((input.hasClass('validateEmail')) && (!validateEmail(input))) ||
         ((input.hasClass('validatePhone')) && (!validatePhone(input))) ||
         ((input.hasClass('validateCPF')) && (!validateCPF(input)))
      ) {
         input.parent().find('.text-muted').show();
         input.addClass('invalid');
         return false;
      } else {
         input.parent().find('.text-muted').hide();
         input.removeClass('invalid');
         return true;
      }
   }

   function validateName(input) {
      return input.val().length > 2;
   }

   function validateEmail(input) {      
      const emailValidation = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?/i;
      return input.val().match(emailValidation);      
   }

   function validatePhone(input) {
      const phoneNumber = input.val().replace(/[-()]+/g, '');
      const phoneValidation = /^[1-9]{2}(?:[1-5]|9[6-9])[0-9]{3}[0-9]{4}$/g;
      return phoneNumber.match(phoneValidation);
   }

   function validateCPF(input) {
      const cpfValidation = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
      return input.val().match(cpfValidation);
   }

})