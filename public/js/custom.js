//Product return to live, time checking
window.setInterval(function () {

  $.get("/return-to-live", {}, function (data_string) {})

}, 10000);
//Product return to live, time checking

//TotalAmount set the Payment Option

$(function () {
  var totalAmount = parseFloat(document.getElementById('totalAmount').innerHTML);
  if (totalAmount > 10000) {
    $('#payment1').children().attr('disabled', true);
  } else {
    $('#payment2').children().attr('disabled', true);
  }

});

//TotalAmount set the Payment Option



// function add1(id){

//   $.get("/cart/update/every/"+id, {}, function(data_string) {

//     var data =JSON.stringify(data_string);

//     // var tbl = document.createElement('table');
//     // tbl.style.width = '100%';
//     // tbl.setAttribute('border', '1');
//     // var tbdy = document.createElement('tbody');
//     for (var i = 0; i < data.cart.length; i++) {
//       var tr = document.createElement('tr');
//       for (var j = 0; j < 5; j++) {
//       //   if (i == 2 && j == 1) {
//       //     break
//       //   } else {
//           var td = document.createElement('td');
//           td.innerHTML= data.cart[i].title;
//           tr.appendChild(td)
//         // }
//       }
//       // tbdy.appendChild(tr);
//       // tbl.appendChild(tbdy);
//       document.getElementById("tab").appendChild(tr)
//     }


// });
// }


//   function tableCreate() {
//     var tbl = document.createElement('table');
//     tbl.style.width = '100%';
//     // tbl.setAttribute('border', '1');
//     var tbdy = document.createElement('tbody');
//     for (var i = 0; i < 3; i++) {
//       var tr = document.createElement('tr');
//       for (var j = 0; j < 2; j++) {
//       //   if (i == 2 && j == 1) {
//       //     break
//       //   } else {
//           var td = document.createElement('td');
//           td.innerHTML="sdfjhsdkjfhkjh";
//           tr.appendChild(td)
//         // }
//       }
//       tbdy.appendChild(tr);
//     }
//     tbl.appendChild(tbdy);
//     document.getElementById("tab").appendChild(tbl)
//    }