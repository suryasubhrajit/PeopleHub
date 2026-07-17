async function loadDashboardData() {
  try {
    const res = await fetch('/dashboard');
    const result = await res.json();
    if (result.success) {
      const stats = result.data;
      
      document.getElementById('totalEmployees').innerText = stats.totalEmployees;
      document.getElementById('totalDepartments').innerText = stats.totalDepartments;
      document.getElementById('averageSalary').innerText = '$' + stats.salaryAnalytics.averageSalary.toLocaleString(undefined, { minimumFractionDigits: 2 });
      document.getElementById('maxSalary').innerText = '$' + stats.salaryAnalytics.maxSalary.toLocaleString(undefined, { minimumFractionDigits: 2 });
      document.getElementById('minSalary').innerText = '$' + stats.salaryAnalytics.minSalary.toLocaleString(undefined, { minimumFractionDigits: 2 });

      // Department breakdown
      const deptBody = document.getElementById('departmentBreakdownBody');
      deptBody.innerHTML = '';
      if (stats.departmentBreakdown.length === 0) {
        deptBody.innerHTML = `<tr><td colspan="2" class="text-center text-muted py-3">No departments found.</td></tr>`;
      } else {
        stats.departmentBreakdown.forEach(dept => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${dept.departmentName}</td>
            <td class="text-center fw-bold">${dept.employeeCount}</td>
          `;
          deptBody.appendChild(tr);
        });
      }

      // Status breakdown
      const statusList = document.getElementById('statusBreakdownList');
      statusList.innerHTML = '';
      if (stats.statusBreakdown.length === 0) {
        statusList.innerHTML = `<li class="list-group-item text-center text-muted border-0">No status data available.</li>`;
      } else {
        stats.statusBreakdown.forEach(item => {
          const li = document.createElement('li');
          li.className = 'list-group-item d-flex justify-content-between align-items-center border-0 px-0';
          li.innerHTML = `
            <span class="d-flex align-items-center">
              <i class="bi bi-circle-fill me-2 fs-6 ${item.status === 'Active' ? 'text-success' : 'text-danger'}"></i>
              ${item.status}
            </span>
            <span class="badge rounded-pill ${item.status === 'Active' ? 'bg-success' : 'bg-danger'} fs-6">${item.count}</span>
          `;
          statusList.appendChild(li);
        });
      }
    }
  } catch (err) {
    console.error('Failed to load dashboard statistics:', err);
  }
}

window.addEventListener('DOMContentLoaded', loadDashboardData);
