export const downloadAdhyayanaApk = async () => {
  try {
    const res = await fetch('/Adhyayana.apk');
    if (!res.ok) throw new Error('Failed to fetch APK file');
    const blob = await res.blob();
    const apkBlob = new Blob([blob], { type: 'application/vnd.android.package-archive' });
    const url = window.URL.createObjectURL(apkBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'Adhyayana.apk';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 1500);
  } catch (err) {
    console.warn('Falling back to direct link download:', err);
    const fallbackLink = document.createElement('a');
    fallbackLink.href = '/Adhyayana.apk';
    fallbackLink.download = 'Adhyayana.apk';
    fallbackLink.click();
  }
};
