// Initialize input values from the default values set in HTML
let propertyTaxRate = parseFloat(document.getElementById('property-tax-rate').value) || 0;
let capitalSubsidy = parseFloat(document.getElementById('capital-subsidy').value) || 0;
let loanTerm = parseInt(document.getElementById('loan-term').value) || 0;
let marketRent = parseFloat(document.getElementById('market-rent').value) || 0;
let pbS8 = document.getElementById('pb-s8').checked ? 810000 : 539520; //if checked, more revenue. if unchecked, base revenue
let interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
let equity = parseFloat(document.getElementById('equity').value) || 0;

// Function to update the number display
function updateNumberDisplay() {
  const largeNumber = document.getElementById('largeNumber');
  // If numberValue is greater than 0, display 0; otherwise, display the formatted numberValue
  const displayValue = numberValue > 0 ? 0 : numberValue;
  largeNumber.textContent = `$${displayValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} per affordable unit`;
}


// Present value function
function pv(rate, nper, pmt, fv,type) {
  if (rate == 0){ 
    pv_value = -(fv + (pmt * nper));
  } else {
    x = Math.pow(1 + rate, -nper);
    y = Math.pow(1 + rate, nper);
    pv_value = -(x * (fv * rate - pmt + y * pmt)) / rate;
  }
  return pv_value*-1;
}

// Function to calculate numberValue based on input variables (excluding the toggle)
function calculateNumberValue() {
  console.log("recalculating")
  affUnits = 30
  grossRevenue = marketRent*(100-affUnits)*12 + pbS8 //add total affordable revenue depending on if pbs8 checked
  propertyTax = (propertyTaxRate/100)*grossRevenue
  vacancy = .05*grossRevenue
  operatingExpenses = 915000
  noi = grossRevenue - operatingExpenses - vacancy - propertyTax
  maxDebt = pv((interestRate/100)/12,
               loanTerm*12,
               (noi/1.15)/12,
               0,
               0
              )
  totalDevelopmentCost = 42250000
  firstMortgage = maxDebt
  cashEquity = totalDevelopmentCost*equity/100
  totalSubsidy = capitalSubsidy*affUnits
  totalGap = cashEquity + firstMortgage + totalSubsidy - totalDevelopmentCost
  
  console.log("affUnits:", affUnits);
  console.log("pbs8:", pbS8);
  console.log("grossRevenue:", grossRevenue);
  console.log("propertyTax:", propertyTax);
  console.log("vacancy:", vacancy);
  console.log("operatingExpenses:", operatingExpenses);
  console.log("noi:", noi);
  console.log("maxDebt:", maxDebt);
  console.log("totalDevelopmentCost:", totalDevelopmentCost);
  console.log("firstMortgage:", firstMortgage);
  console.log("cashEquity:", cashEquity);
  console.log("totalSubsidy:", totalSubsidy);
  console.log("totalGap:", totalGap);
  return totalGap/affUnits
}

// Initialize numberValue as the sum of the inputs
let numberValue = calculateNumberValue();
updateNumberDisplay(); // Update the display with the initial value

// Function to handle input changes
document.getElementById('inputForm').addEventListener('input', () => {
  // Recalculate each input value whenever the input changes
  propertyTaxRate = parseFloat(document.getElementById('property-tax-rate').value) || 0;
  capitalSubsidy = parseFloat(document.getElementById('capital-subsidy').value) || 0;
  loanTerm = parseInt(document.getElementById('loan-term').value) || 0;
  marketRent = parseFloat(document.getElementById('market-rent').value) || 0;
  pbS8 = document.getElementById('pb-s8').checked ? 810000 : 539520; //if checked, more revenue. if unchecked, base revenue
  interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
  equity = parseFloat(document.getElementById('equity').value) || 0;

  // Recalculate numberValue
  numberValue = calculateNumberValue();
  updateNumberDisplay();
});

// Function to handle "Close the Gap" button click
document.getElementById('closeGapBtn').addEventListener('click', () => {
  // Set input fields to their placeholder values
  document.getElementById('property-tax-rate').value = 0;
  document.getElementById('capital-subsidy').value = 5000;
  document.getElementById('loan-term').value = 40;
  document.getElementById('market-rent').value = 3500;
  document.getElementById('pb-s8').checked = true; 
  document.getElementById('interest-rate').value = 5.7;
  document.getElementById('equity').value = 20;

  // Recalculate each input value whenever the input changes
  propertyTaxRate = parseFloat(document.getElementById('property-tax-rate').value) || 0;
  capitalSubsidy = parseFloat(document.getElementById('capital-subsidy').value) || 0;
  loanTerm = parseInt(document.getElementById('loan-term').value) || 0;
  marketRent = parseFloat(document.getElementById('market-rent').value) || 0;
  pbS8 = document.getElementById('pb-s8').checked ? 810000 : 539520; //if checked, more revenue. if unchecked, base revenue
  interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
  equity = parseFloat(document.getElementById('equity').value) || 0;

  // Update the display
  numberValue = calculateNumberValue();
  updateNumberDisplay();
});

