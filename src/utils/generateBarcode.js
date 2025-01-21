export function generateBarcode(dom, val) {
  var settings = {
    output: "bmp",
    moduleSize: 5,
    marginHRI: 0,
    // addQuietZone: $('#quietZoneSize').val(),
  };
  console.log();
  $("#" + dom)
    .html("")
    .show()
    .barcode(val, "datamatrix", settings);
}
