var _a, _b, _c, _d;
import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";
const manager = new StudentManager();
manager.loadFromLocalStorage();
function renderTable(elementId = "studentTableBody") {
    const tableBody = document.getElementById(elementId);
    tableBody.innerHTML = "";
    const students = manager.getAllStudents();
    showList(students);
    students.forEach((s) => {
        tableBody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.title_name}</td>
        <td>${s.first_name}</td>
        <td>${s.last_name}</td>
        <td>${s.email}</td>
        <td>${s.year}</td>
        <td>${s.major}</td>
      </tr>
    `;
    });
}
(_a = document.getElementById("addBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    const id = document.getElementById("id").value;
    const title_name = document.getElementById("title_name").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const year = Number(document.getElementById("year").value);
    const major = document.getElementById("major").value;
    if (!id || !title_name || !first_name || !last_name || !email || !year || !major) {
        alert("กรุณากรอกข้อมูลให้ครบทั้งหมด");
        return;
    }
    const student = { id, title_name, first_name, last_name, email, year, major };
    manager.addStudent(student);
    renderTable();
    // Clear form
    document.getElementById("id").value = "";
    document.getElementById("title_name").value = "";
    document.getElementById("first_name").value = "";
    document.getElementById("last_name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("year").value = "";
    document.getElementById("major").value = "";
    alert("เพิ่มนักศึกษาสำเร็จ");
});
(_b = document.getElementById("searchNameBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    const keyword = document.getElementById("searchName").value;
    const results = manager.findStudentsByName(keyword);
    showList(results);
    alert(`ผลการค้นหา: ${results.length} คน`);
});
(_c = document.getElementById("searchMajorBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    const keyword = document.getElementById("searchMajor").value;
    const results = manager.findStudentsByMajor(keyword);
    showList(results);
    alert(`พบในสาขา: ${results.length} คน`);
});
(_d = document.getElementById("searchEmailBtn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
    const keyword = document.getElementById("searchEmail").value;
    const results = manager.findStudentsByEmail(keyword);
    showList(results);
    alert(`ผลการค้นหา Email: ${results.length} คน`);
});
renderTable("studentTableBody");
