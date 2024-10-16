// Initialize input values from the default values set in HTML
let propertyTaxRate = parseFloat(document.getElementById('property-tax-rate').value) || 0;
let capitalSubsidy = parseFloat(document.getElementById('capital-subsidy').value) || 0;
let loanTerm = parseInt(document.getElementById('loan-term').value) || 0;
let marketRent = parseFloat(document.getElementById('market-rent').value) || 0;
let pbS8 = document.getElementById('pb-s8').checked ? 810000 : 539520; //if checked, more revenue. if unchecked, base revenue
let interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
let equity = parseFloat(document.getElementById('equity').value) || 0;

let numberValue = -399706;  // Fixed value (black triangle)


// Function to update the number display
function updateNumberDisplay() {
  const largeNumber = document.getElementById('largeNumber');
  // If numberValue is greater than 0, display 0; otherwise, display the formatted numberValue
  const displayValue = numberValue > 0 ? 0 : numberValue;
  const numberColor = numberValue < 0 ? '#ed004a' : 'black';  // Change color
  largeNumber.innerHTML = `<span style="color: ${numberColor};">$${displayValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span> gap per affordable unit`;

  drawTriangles(fixedValue, numberValue);  // Update the triangles
}

const svgWidth = 600;
const svgHeight = 100;
const margin = { left: 50, right: 50 };
const chartWidth = svgWidth - margin.left - margin.right;

const svg = d3.select("#numberLine")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Updated xScale with range from -100 to 100
const xScale = d3.scaleLinear()
    .domain([-400000, 100000])  // Number line range
    .range([margin.left, chartWidth + margin.left]);

const xAxis = d3.axisBottom(xScale).ticks(10);

// Append X axis (number line)
svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${svgHeight / 2})`)
    .call(xAxis);

// Fixed value (always 100)
const fixedValue = -399706;  // Fixed value (black triangle)

// Function to draw triangles on the number line
function drawTriangles(fixed, dynamic) {
    // Remove any existing triangles before drawing new ones
    svg.selectAll(".triangle").remove();

    console.log(fixed, dynamic)

    // Function to draw an upside-down triangle
    const drawTriangle = (x, y, fill) => {
        svg.append("path")
            .attr("class", "triangle")
            .attr("d", d3.symbol().type(d3.symbolTriangle).size(200))
            .attr("transform", `translate(${x}, ${y}) rotate(180)`)
            .attr("fill", fill);
    };


    // Draw the fixed triangle (black)
    drawTriangle(xScale(fixed), svgHeight / 2, "#0d6efd");

    // Draw the dynamic triangle (red)
    const dynamicColor = numberValue >= 0 ? "black" : "#ed004a";
    drawTriangle(xScale(dynamic), svgHeight / 2, dynamicColor);
}

// Initial drawing of triangles (fixed at 100, dynamic at -75)
drawTriangles(fixedValue, -399706);

// Present value function
function pv(rate, nper, pmt, fv, type) {
  if (rate == 0) {
    pv_value = -(fv + (pmt * nper));
  } else {
    x = Math.pow(1 + rate, -nper);
    y = Math.pow(1 + rate, nper);
    pv_value = -(x * (fv * rate - pmt + y * pmt)) / rate;
  }
  return pv_value * -1;
}

// Function to calculate numberValue based on input variables (excluding the toggle)
function calculateNumberValue() {
  console.log("recalculating")
  affUnits = 30
  grossRevenue = marketRent * (100 - affUnits) * 12 + pbS8 //add total affordable revenue depending on if pbs8 checked
  propertyTax = (propertyTaxRate / 100) * grossRevenue
  vacancy = .05 * grossRevenue
  operatingExpenses = 915000
  noi = grossRevenue - operatingExpenses - vacancy - propertyTax
  maxDebt = pv((interestRate / 100) / 12,
    loanTerm * 12,
    (noi / 1.15) / 12,
    0,
    0
  )
  totalDevelopmentCost = 42250000
  firstMortgage = maxDebt
  cashEquity = totalDevelopmentCost * equity / 100
  totalSubsidy = capitalSubsidy * affUnits
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
  return totalGap / affUnits
}

// Initialize numberValue as the sum of the inputs
numberValue = calculateNumberValue();
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

// Function to reset input values to the original ones
function resetForm() {
  document.getElementById('property-tax-rate').value = 8.0;
  document.getElementById('capital-subsidy').value = 0;
  document.getElementById('loan-term').value = 30;
  document.getElementById('market-rent').value = 3000;
  document.getElementById('pb-s8').checked = false;
  document.getElementById('interest-rate').value = 5.7;
  document.getElementById('equity').value = 20;

  // Recalculate input values
  propertyTaxRate = 8.0;
  capitalSubsidy = 0;
  loanTerm = 30;
  marketRent = 3000;
  pbS8 = 539520; // Reset back to unchecked value
  interestRate = 5.7;
  equity = 20;

  // Recalculate the number value
  numberValue = calculateNumberValue();
  updateNumberDisplay();
}

// Event listener for the Reset button
document.getElementById('resetBtn').addEventListener('click', resetForm);