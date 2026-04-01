    let rowCount = 0;

    // Add a new course row to the table
    function addRow() {
      const tbody = document.getElementById("table-body");
      const id = rowCount++;

      const tr = document.createElement("tr");
      tr.id = "row-" + id;

      tr.innerHTML = `
        <td><input type="text" id="name-${id}" placeholder="e.g. MTH 201" /></td>
        <td><input type="number" id="grade-${id}" placeholder="0.0 – 5.0" min="0" max="5" step="0.1" /></td>
        <td><input type="number" id="credit-${id}" placeholder="e.g. 3" min="1" max="6" step="1" /></td>
        <td><button onclick="removeRow(${id})">X</button></td>
      `;

      tbody.appendChild(tr);
    }

    // Remove a specific row
    function removeRow(id) {
      const row = document.getElementById("row-" + id);
      if (row) row.remove();
    }

    // Calculate GPA using: Σ(grade × credit) / Σ(credit)
    function calculate() {
      const rows = document.querySelectorAll("#table-body tr");
      const errorMsg = document.getElementById("error-msg");
      const resultSection = document.getElementById("result-section");

      errorMsg.style.display = "none";
      errorMsg.textContent = "";

      // Must have at least one row
      if (rows.length === 0) {
        errorMsg.textContent = "Add at least one course before calculating.";
        errorMsg.style.display = "block";
        return;
      }

      let totalCredits = 0;
      let totalPoints = 0;
      const summaryData = [];
      let hasError = false;

      rows.forEach(row => {
        const id = row.id.replace("row-", "");

        const nameInput = document.getElementById("name-" + id);
        const gradeInput = document.getElementById("grade-" + id);
        const creditInput = document.getElementById("credit-" + id);

        const name = nameInput.value.trim() || "Unnamed Course";
        const grade = parseFloat(gradeInput.value);
        const credit = parseFloat(creditInput.value);

        // Validate grade and credit
        if (isNaN(grade) || grade < 0 || grade > 5) {
          hasError = true;
          return;
        }
        if (isNaN(credit) || credit < 1) {
          hasError = true;
          return;
        }

        const gradePoints = grade * credit;
        totalCredits += credit;
        totalPoints += gradePoints;

        summaryData.push({ name, grade, credit, gradePoints });
      });

      if (hasError) {
        errorMsg.textContent = "One or more rows have invalid input. Grade must be 0–5 and credit must be at least 1.";
        errorMsg.style.display = "block";
        resultSection.style.display = "none";
        return;
      }

      // Compute final GPA
      const gpa = totalPoints / totalCredits;

      // Display GPA
      document.getElementById("gpa-value").textContent = gpa.toFixed(2);

      // Fill summary table
      const summaryBody = document.getElementById("summary-body");
      summaryBody.innerHTML = "";

      summaryData.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${row.name}</td>
          <td>${row.grade.toFixed(1)}</td>
          <td>${row.credit}</td>
          <td>${row.gradePoints.toFixed(1)}</td>
        `;
        summaryBody.appendChild(tr);
      });

      document.getElementById("total-credits").textContent = totalCredits;
      document.getElementById("total-points").textContent = totalPoints.toFixed(1);

      resultSection.style.display = "block";
    }

    // Reset everything back to default
    function resetAll() {
      document.getElementById("table-body").innerHTML = "";
      document.getElementById("summary-body").innerHTML = "";
      document.getElementById("gpa-value").textContent = "";
      document.getElementById("total-credits").textContent = "";
      document.getElementById("total-points").textContent = "";
      document.getElementById("result-section").style.display = "none";
      document.getElementById("error-msg").style.display = "none";
      rowCount = 0;

      // Start fresh with 3 empty rows
      addRow();
      addRow();
      addRow();
    }

    // Start with 3 rows on page load
    addRow();
    addRow();
    addRow();