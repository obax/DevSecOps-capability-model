/**
 * Render an HTML table onto the page using D3.js
 * Could have rendered by hand but d3 give us some nice
 * abstractions
 * @see http://bl.ocks.org/AMDS/4a61497182b8fcb05906
 *
 * @param {string} id document id you want to inject table into
 * @param {obj} headings array of headings
 * @param {obj} data the data you wish to render
 * @param {obj} options options
 */
function generateTable(id, headings, data, options) {
  const cfg = { sortAscending: true };

  //Put all of the options into a variable called cfg
  if (typeof options !== "undefined") {
    for (let i in options) {
      if (typeof options[i] !== "undefined") {
        cfg[i] = options[i];
      }
    }
  }

  const table = d3.select(id).append("table").attr("class", "table table-striped");

  // table headers w/ popovers
  const headers = table
    .append("thead")
    .attr("class", "thead-dark")
    .append("tr")
    .selectAll("th")
    .data(headings)
    .enter()
    .append("th")
    .attr("data-content", (d) => d.description)
    .attr("data-toggle", "popover")
    .text((d) => d.title)
    .on("click", (d) => {
      headers.attr("class", "header");
      if (options.sortAscending) {
        rows.sort((a, b) => d3.ascending(Object.values(b)[0].value, Object.values(a)[0].value));
        options.sortAscending = false;
        this.className = "aes";
      } else {
        rows.sort((a, b) => d3.descending(Object.values(b)[0].value, Object.values(a)[0].value));
        options.sortAscending = true;
        this.className = "des";
      }
    });

  // render rows
  const rows = table.append("tbody").attr("class", "").selectAll("tr").data(data).enter().append("tr");
  // now add row text and metadata via hovering bootstrap tooltips
  rows
    .selectAll("td")
    .data((data) => {
      return headings.map((heading) => {
        let questions = [];
        if ("questions" in data[heading.title]) {
          questions = data[heading.title].questions;
        }
        return {
          value: data[heading.title].value,
          name: heading.title,
          description: data[heading.title].description,
          questions
        };
      });
    })
    .enter()
    .append("td")
    .attr("data-th", (d) => d.name)
    .attr("title", (d) => d.name)
    .attr("data-content", (d) => {
      let questions = d.questions.reduce((acc, el) => {
        acc += `<li>${el}</li>`;
        return acc;
      }, "");
      return `${d.description}<hr>${questions}`;
    })
    .attr("data-toggle", "popover")
    .text((d) => d.value);
}
