//Product return to live, time checking
// window.setInterval(function() {
//   $.get("/return-to-live", {}, function(data_string) {});
// }, 10000);
//Product return to live, time checking

//TotalAmount set the Payment Option
$(function() {
  var totalAmount = parseFloat(
    document.getElementById("totalAmount").innerHTML
  );
  if (totalAmount > 10000) {
    $("#payment1")
      .children()
      .hide();
    $("#payment1")
      .children()
      .attr("disabled", true);
    document.getElementById("hints").style.color = "red";
    document.getElementById("hints").innerHTML =
      "Cash on Delivery is not applicable for amount more than 10000Tk.";
  } else {
    $("#payment2")
      .children()
      .hide();
    $("#payment2")
      .children()
      .attr("disabled", true);
    document.getElementById("hints").style.color = "red";
    document.getElementById("hints").innerHTML =
      "Cash on Delivery & Online Pay both are applicable for amount 10000Tk or less.";
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

//Product quantity inecrease
$(document).on("click", "#plus", function(e) {
  e.preventDefault();
  var priceValue = parseFloat($("#priceValue").val());
  var quantity = parseInt($("#quantity").val());

  priceValue += parseFloat($("#priceHidden").val());
  quantity += 1;

  $("#quantity").val(quantity);
  $("#priceValue").val(priceValue.toFixed(2));
  $("#total").html(quantity);
});

//Product quantity  decrease
$(document).on("click", "#minus", function(e) {
  e.preventDefault();
  var priceValue = parseFloat($("#priceValue").val());
  var quantity = parseInt($("#quantity").val());

  if (quantity == 1) {
    priceValue = $("#priceHidden").val();
    quantity = 1;
  } else {
    priceValue -= parseFloat($("#priceHidden").val());
    quantity -= 1;
  }

  $("#quantity").val(quantity);
  $("#priceValue").val(priceValue.toFixed(2));
  $("#total").html(quantity);
});

//Print PDF
// $("#cmd").click(function() {
//   domtoimage.toPng(document.getElementById("pcQuotation")).then(function(blob) {
//     var pdf = new jsPDF("l", "pt", [
//       $("#pcQuotation").width(),
//       $("#pcQuotation").height()
//     ]);

//     pdf.addImage(
//       blob,
//       "PNG",
//       0,
//       0,
//       $("#pcQuotation").width(),
//       $("#pcQuotation").height()
//     );
//     pdf.save("test.pdf");

//     that.options.api.optionsChanged();
//   });
// });

$(function() {
  var specialElementHandlers = {
    "#editor": function(element, renderer) {
      return true;
    }
  };
  $("#cmd").click(function() {
    var doc = new jsPDF();
    doc.fromHTML(
      $("#pcQuotation").html(),
      15,
      15,
      { width: 100, elementHandlers: specialElementHandlers },
      function() {
        doc.save("sample-file.pdf");
      }
    );
  });
});
//Print PDF
