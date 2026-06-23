// const fs = require('fs');

// async function check() {
//   const Jimp = require('jimp');
//   const files = [
//     'Bajnath.jpg', 'PRN06785.JPG', 'about.JPG', 'bagwasher.jpg', 'bagwasher2.jpg',
//     'collegeevent.jpg', 'collegeevent2.jpg', 'collegeevent3.jpg', 'collegeevent4.jpg',
//     'devdoli.jpg', 'devdoli2.jpg', 'devlang.jpg', 'devlangfestival.jpg', 'distichackthon.jpg',
//     'dolaashram.jpg', 'gallery.JPG', 'gangnanimandir.jpg', 'gangotri.jpg',
//     'group.jpg', 'group2.jpg', 'group3.jpg', 'group4.jpg', 'group5.jpg', 'group6.jpg', 'group7.jpg',
//     'hanumanji.jpg', 'iotkit.jpg', 'iotkit2.jpg', 'jagwesharmandir.jpg',
//     'lakahmandal.jpg', 'lakahmandal2.jpg', 'lakhamandal3.jpg', 'lakhamandal4.jpg',
//     'maachandikmandir.jpg', 'me10.JPG', 'me11.JPG', 'me12.JPG', 'me13.JPG', 'me14.JPG',
//     'me15.JPG', 'me16.JPG', 'me17.JPG', 'me3.jpg', 'me4.JPG', 'me5.jpg', 'me6.png',
//     'me7.JPG', 'me7.png', 'me8.JPG', 'me9.JPG', 'myclick.jpg', 'myclick10.jpg',
//     'myclick11.jpg', 'myclick12.jpg', 'myclick13.jpg', 'myclick14.jpg', 'myclick15.jpg',
//     'myclick16.jpg', 'myclick17.jpg', 'myclick18.jpg', 'myclick19.jpg', 'myclick2.jpg',
//     'myclick20.jpg', 'myclick21.jpg', 'myclick22.JPG', 'myclick3.jpg', 'myclick4.jpg',
//     'myclick5.jpg', 'myclick6.jpg', 'myclick7.jpg', 'myclick8.jpg', 'myclick9.jpg',
//     'mypic.jpg', 'mypic2.jpg', 'pic1.JPG', 'pic2.JPG', 'pic3.JPG', 'smartigrrationsystem.jpg',
//     'suntemple.jpg', 'suntemple2.jpg', 'temple.jpg', 'temple2.jpg', 'temple3.jpg'
//   ];

//   for (const f of files) {
//     if (fs.existsSync(`pic/${f}`)) {
//         try {
//             const image = await Jimp.read(`pic/${f}`);
//             console.log(`w: ${image.bitmap.width}, h: ${image.bitmap.height} - ${f}`);
//         } catch(e) {}
//     }
//   }
// }
// check();
