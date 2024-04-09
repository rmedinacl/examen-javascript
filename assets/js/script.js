const url = "https://mindicador.cl/api/";
const form = document.querySelector("#convertidor_monedas");
const chart = document.querySelector("#myChart");
let myChart;

const getDataDivisa = async (url, divisa) => {
  try {
    const response = await fetch(`${url}${divisa}`);
    if (!response.ok) {
      throw new Error("No se ha logrado conectar con API de Divisas");
    }
    const data = await response.json();
    console.log(data);
    return data.serie;
  } catch (error) {
    alert(error.message);
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = form.elements["value"].value;
  const divisa = form.elements["divisa"].value;

  const data = await getDataDivisa(url, divisa);
  await totalRenderHtml(value, data);
});

const totalConvertDivisa = (value, data) => {
  const valueDivisa = data[0].valor;
  const totalSwap = value / valueDivisa;
  return totalSwap.toFixed(2);
};

const renderSwap = (total) => {
  const resultString = total
    ? `Total: ${parseFloat(total)}`
    : "Ingrese un monto y seleccione una divisa.";
  document.querySelector("#totalConverter").innerHTML = resultString;
};

const getValueDivisa = (data) => {
  return data.map((item) => item.valor);
};

const getDateDivisa = (data) => {
  return data.map((item) => new Date(item.fecha).toLocaleDateString("es-CL"));
};

const destroyChart = () => {
  if (myChart) {
    myChart.destroy();
  }
};

const totalRenderHtml = async (value, data) => {
  renderSwapChart(value, data);
};

const renderSwapChart = (value, data) => {
  if (!data || data.length === 0) {
    renderSwap(0);
    destroyChart();
    return;
  }

  const lastTenDaysData = data.slice(-10);

  const total = totalConvertDivisa(value, lastTenDaysData);
  renderSwap(total);

  const dateLabels = getDateDivisa(lastTenDaysData);
  const currencyValues = getValueDivisa(lastTenDaysData);

  const datasets = [
    {
      label: "Moneda",
      borderColor: "red",
      data: currencyValues,
    },
  ];
  const config = {
    type: "line",
    data: { labels: dateLabels, datasets },
  };

  destroyChart();
  chart.style.backgroundColor = "white";
  chart.style.color = "black";
  chart.style.borderRadius = "15px";

  myChart = new Chart(chart, config);
};
