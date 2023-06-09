// Şablon objesi
const template = (e) => `
  <div>
    <h1 data-id="${e.id}">${e.task} - ${e.completed ? 'TAMAM' : ''}</h1>
  </div>
`.content;

// Liste oluşturma fonksiyonu
const renderList = (arr, container) => {
  // Önceki listeyi kopyala
  const prevList = [...container.children];

  // Yeni liste için boş bir dizi oluştur
  const newList = [];

  // Her öğe için bir şablon oluştur
  arr.forEach((item) => {
    const el = document.createElement('div');
    el.innerHTML = template(item);

    // Eğer öğe zaten varsa, içeriğini güncelle
    const prevItem = prevList.find((prev) => prev.querySelector('h1').dataset.id === item.id);
    if (prevItem) {
      prevItem.innerHTML = el.innerHTML;
      newList.push(prevItem);
    } else {
      newList.push(el);
    }
  });

  // Önceki listeyi silmeden önce yeni öğeleri ekle
  newList.forEach((item) => {
    container.appendChild(item);
  });

  // Önceki öğeleri sil
  prevList.forEach((item) => {
    item.remove();
  });
};

// Örnek bir array
const array = [
  { id: 1, task: 'eve git', completed: false },
  { id: 2, task: 'su iç', completed: true },
  { id: 3, task: 'selamlaş', completed: true }
];

// Örnek bir container
const app = document.getElementById('app');

// Liste öğelerini renderla
renderList(array, app);

// Öğeleri güncelle
//array[0].task = 'Eve dön';
