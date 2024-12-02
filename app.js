// Sayfa geçişleri
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById(sectionId).classList.add("active");
  }
  
  //  depolama 
  let courses = JSON.parse(localStorage.getItem("courses")) || [];
  let coursePointSysDict = JSON.parse(localStorage.getItem("coursePointSysDict")) || {};
  let students = JSON.parse(localStorage.getItem("students")) || [];
  
  console.log(courses, coursePointSysDict);
  updateCourseTable();
  updateStudentTable();
  updateCourseSelect();
  
  // Ders ekleme 
  function addCourse() {
    const courseName = document.getElementById("courseName").value;
    const coursePointSys = document.getElementById("coursePointSys").value;
    if (courseName && coursePointSys) {
      courses.push(courseName);
      coursePointSysDict[courseName] = coursePointSys;
      updateCourseSelect();
      updateCourseTable(); // Ders listesini güncelle
      document.getElementById("courseName").value = "";
      document.getElementById("coursePointSys").value = "";
    }
    localStorage.setItem("courses", JSON.stringify(courses));
    localStorage.setItem("coursePointSysDict", JSON.stringify(coursePointSysDict));
  }
  
  // Ders listesi güncelleme 
  function updateCourseTable() {
    const courseTable = document.getElementById("courseTable");
    courseTable.innerHTML = "";
    courses.forEach((course, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${course}</td>
              <td>${coursePointSysDict[course]}</td>
              <td><button onclick="deleteCourse(${index})">Sil</button></td>
          `;
      courseTable.appendChild(row);
    });
  }
  
  // Ders silme 
  function deleteCourse(index) {
    const course = courses[index];
    courses.splice(index, 1); // Dersi sil
    delete coursePointSysDict[course]; // Grading sistemini de sil
    updateCourseSelect();
    updateCourseTable();
    localStorage.setItem("courses", JSON.stringify(courses));
    localStorage.setItem("coursePointSysDict", JSON.stringify(coursePointSysDict));
  }
  
  //  ders seçim listesi güncelleme
  function updateCourseSelect() {
    const courseSelect = document.getElementById("courseSelect");
    courseSelect.innerHTML = "";
    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course;
      option.textContent = course;
      courseSelect.appendChild(option);
    });
  }
  
  // Öğrenci ekleme 
  function addStudent() {
    const name = document.getElementById("studentName").value;
    const midterm = parseFloat(document.getElementById("studentMidterm").value);
    const final = parseFloat(document.getElementById("studentFinal").value);
    const course = document.getElementById("courseSelect").value;
  
    if (name && !isNaN(midterm) && !isNaN(final) && course) {
      let grade;
      if (coursePointSysDict[course] === "10") {
        grade = calculateGrade10(midterm, final);
      } else {
        grade = calculateGrade7(midterm, final);
      }
      students.push({ name, midterm, final, course, grade });
      updateStudentTable();
      // Alanları temizle
      document.getElementById("studentName").value = "";
      document.getElementById("studentMidterm").value = "";
      document.getElementById("studentFinal").value = "";
    }
    localStorage.setItem("students", JSON.stringify(students));
  }
  
  // Harf notu hesaplama 
  function calculateGrade10(midterm, final) {
    // 10'luk sisteme göre
    const total = midterm * 0.4 + final * 0.6;
    if (total >= 90) return "A";
    else if (total >= 80) return "B";
    else if (total >= 70) return "C";
    else if (total >= 60) return "D";
    else return "F";
  }
  
  function calculateGrade7(midterm, final) {
    // 7'lik sisteme göre
    const total = midterm * 0.4 + final * 0.6;
    if (total >= 93) return "A";
    else if (total >= 85) return "B";
    else if (total >= 77) return "C";
    else if (total >= 70) return "D";
    else return "F";
  }
  
  // Öğrenci listesini güncelleme ve tabloya ekleme
  function updateStudentTable() {
    const studentTable = document.getElementById("studentTable");
    studentTable.innerHTML = "";
  
    students.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${student.name}</td>
              <td>${student.midterm}</td>
              <td>${student.final}</td>
              <td>${student.course}</td>
              <td>${student.grade}</td>
              <td><button onclick="deleteStudent(${index})">Sil</button></td>
          `;
      studentTable.appendChild(row);
    });
  }
  
  // Öğrenci silme fonksiyonu
  function deleteStudent(index) {
    students.splice(index, 1);
    updateStudentTable();
    localStorage.setItem("students", JSON.stringify(students));
  }
  