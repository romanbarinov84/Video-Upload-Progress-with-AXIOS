  let abortController;

    function sendRequest() {
      if (abortController) {
        abortController.abort();
        console.log("Предыдущий запрос отменён");
      }

      abortController = new AbortController();

      const videoFile = document.getElementById("videoFile").files[0];
      const message = document.getElementById("output");

      if (!videoFile) {
        message.textContent = "Выберите видеофайл!";
        return;
      }

      const data = new FormData();
      data.append("video", videoFile);

      axios({
        method: "post",
        url: "https://httpbin.org/post",
        data: data,
        signal: abortController.signal,
        maxBodyLength: 100 * 1024 * 1024,
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          document.getElementById("uploadProgress").value = percent;
          document.getElementById("uploadPercenage").textContent = percent + "%";
          message.textContent = `Загрузка: ${percent}%`;
        },
        onDownloadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          document.getElementById("downloadProgress").value = percent;
          document.getElementById("downloadPercenage").textContent = percent + "%";
        }
      })
      .then((response) => {
        message.textContent = "Загрузка завершена ✅";
        console.log("Ответ сервера:", response.data);
      })
      .catch((error) => {
        if (error.name === "CanceledError") {
          console.log("Запрос был отменён пользователем");
          message.textContent = "Загрузка отменена ❌";
        } else {
          console.error("Ошибка:", error.message);
          message.textContent = "Ошибка загрузки ⚠️";
        }
      });
    }

    document.getElementById("uploadButton").addEventListener("click", sendRequest);

    document.getElementById("cancelButton").addEventListener("click", () => {
      if (abortController) {
        abortController.abort();
        const message = document.getElementById("output");
        message.textContent = "Запрос отменён пользователем";
      }
    });