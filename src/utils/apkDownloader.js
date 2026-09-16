export const downloadAdhyayanaApk = () => {
  const link = document.createElement('a');
  link.href = '/Adhyayana.apk';
  link.download = 'Adhyayana.apk';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 1500);
};
