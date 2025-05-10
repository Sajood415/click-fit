$(document).ready(function () {
  $("body").css("padding-top", $(".navbar").outerHeight() + "px");

  $(window).scroll(function () {
    if ($(window).scrollTop() > 50) {
      $(".navbar").addClass("navbar-scrolled").css("padding", "0.5rem 0");
    } else {
      $(".navbar").removeClass("navbar-scrolled").css("padding", "1rem 0");
    }

    $(".feature-card, .testimonial-item").each(function () {
      const bottom_of_object = $(this).offset().top + $(this).outerHeight();
      const bottom_of_window = $(window).scrollTop() + $(window).height();

      if (bottom_of_window > bottom_of_object) {
        $(this).addClass("animate__animated animate__fadeInUp");
      }
    });
  });

  $.ajax({
    url: "http://numbersapi.com/1/30/date?json",
    dataType: "json",
    success: function (data) {
      $("#daily-fact").text(data.text);
      $("#daily-fact-container").addClass("animate__animated animate__fadeIn");
    },
    error: function () {
      $("#daily-fact").text(
        "Could not load daily fact. Please try again later."
      );
    },
  });

  const dropArea = document.querySelector("#upload-container");
  const fileInput = document.querySelector("#file-input");
  const previewContainer = document.querySelector("#preview-container");
  const uploadStatus = document.querySelector("#upload-status");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    dropArea.classList.add("highlight");
  }

  function unhighlight() {
    dropArea.classList.remove("highlight");
  }

  dropArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }

  fileInput.addEventListener("change", function () {
    handleFiles(this.files);
  });

  function handleFiles(files) {
    const validFiles = Array.from(files).filter((file) => {
      const fileType = file.type.toLowerCase();
      return (
        fileType === "image/png" ||
        fileType === "image/jpeg" ||
        fileType === "image/jpg"
      );
    });

    if (validFiles.length === 0) {
      showUploadStatus("Please select only PNG, JPEG or JPG images.", "error");
      return;
    }

    validFiles.forEach(previewFile);
    uploadFiles(validFiles);
  }

  function previewFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      const col = document.createElement("div");
      col.className = "col-md-4 col-sm-6";

      const img = document.createElement("img");
      img.src = reader.result;
      img.className = "img-fluid shadow-sm";

      col.appendChild(img);
      previewContainer.appendChild(col);
    };
  }

  function uploadFiles(files) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    showUploadStatus("Uploading...", "info");

    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showUploadStatus("Upload successful!", "success");
        } else {
          showUploadStatus("Upload failed: " + data.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showUploadStatus("Upload failed. Please try again later.", "error");
      });
  }

  function showUploadStatus(message, type) {
    uploadStatus.innerHTML = "";

    const alert = document.createElement("div");
    alert.className = `alert alert-${
      type === "error" ? "danger" : type === "success" ? "success" : "info"
    }`;
    alert.textContent = message;

    uploadStatus.appendChild(alert);

    if (type === "success") {
      setTimeout(() => {
        alert.remove();
      }, 5000);
    }
  }

  $("#testimonialCarousel").carousel({
    interval: 5000,
  });

  $("a.nav-link, a.btn").on("click", function (e) {
    if (this.hash !== "") {
      e.preventDefault();
      const hash = this.hash;
      $("html, body").animate(
        {
          scrollTop: $(hash).offset().top - $(".navbar").outerHeight(),
        },
        800
      );
    }
  });
});
