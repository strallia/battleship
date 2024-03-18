const announcementDiv = document.querySelector('.announcement');

const updateAnnouncement = (string) => {
  announcementDiv.textContent = string;
};

export { updateAnnouncement };
