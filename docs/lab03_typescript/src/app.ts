import { Student } from "./models/Student.js";
import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";


const manager = new StudentManager();
manager.loadFromLocalStorage();


function renderTable(elementId: string = "studentTableBody"): void {
  const tableBody = document.getElementById(elementId)!;
  tableBody.innerHTML = "";
  const students =manager.getAllStudents();
  showList<Student>(students);
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


(document.getElementById("addBtn") as HTMLButtonElement)?.addEventListener("click", () => {
  const id = (document.getElementById("id") as HTMLInputElement).value;
  const title_name = (document.getElementById("title_name") as HTMLInputElement).value;
  const first_name = (document.getElementById("first_name") as HTMLInputElement).value;
  const last_name = (document.getElementById("last_name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const year = Number((document.getElementById("year") as HTMLInputElement).value);
  const major = (document.getElementById("major") as HTMLInputElement).value;
  
  if (!id || !title_name || !first_name || !last_name || !email || !year || !major) {
    alert("กรุณากรอกข้อมูลให้ครบทั้งหมด");
    return;
  }
  
  const student: Student = { id, title_name, first_name, last_name, email, year, major };
  manager.addStudent(student);
  renderTable();
  
  // Clear form
  (document.getElementById("id") as HTMLInputElement).value = "";
  (document.getElementById("title_name") as HTMLInputElement).value = "";
  (document.getElementById("first_name") as HTMLInputElement).value = "";
  (document.getElementById("last_name") as HTMLInputElement).value = "";
  (document.getElementById("email") as HTMLInputElement).value = "";
  (document.getElementById("year") as HTMLInputElement).value = "";
  (document.getElementById("major") as HTMLInputElement).value = "";
  
  alert("เพิ่มนักศึกษาสำเร็จ");
});


(document.getElementById("searchNameBtn") as HTMLButtonElement)?.addEventListener("click", () => {
  const keyword = (document.getElementById("searchName") as HTMLInputElement).value;
  const results = manager.findStudentsByName(keyword);
  showList<Student>(results);
  alert(`ผลการค้นหา: ${results.length} คน`);
});


(document.getElementById("searchMajorBtn") as HTMLButtonElement)?.addEventListener("click", () => {
  const keyword = (document.getElementById("searchMajor") as HTMLInputElement).value;
  const results = manager.findStudentsByMajor(keyword);
  showList<Student>(results);
  alert(`พบในสาขา: ${results.length} คน`);
});


(document.getElementById("searchEmailBtn") as HTMLButtonElement)?.addEventListener("click", () => {
  const keyword = (document.getElementById("searchEmail") as HTMLInputElement).value;
  const results = manager.findStudentsByEmail(keyword);
  showList<Student>(results);
  alert(`ผลการค้นหา Email: ${results.length} คน`);
});


renderTable("studentTableBody");