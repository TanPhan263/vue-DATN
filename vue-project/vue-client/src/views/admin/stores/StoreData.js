const usersData = [
  { storename: 'Samppa Nori', registered: '2012/01/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Active'},
  { storename: 'Estavan Lykos', registered: '2012/02/01',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Banned'},
  { storename: 'Chetan Mohamed', registered: '2012/02/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Đồ uống', status: 'Inactive'},
  { storename: 'Derick Maximinus', registered: '2012/03/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Pending'},
  { storename: 'Friderik Dávid', registered: '2012/01/21',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Active'},
  { storename: 'Yiorgos Avraamu', registered: '2012/01/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Active'},
  { storename: 'Avram Tarasios', registered: '2012/02/01',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Banned', _classes: 'table-success'},
  { storename: 'Quintin Ed', registered: '2012/02/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Đồ uống', status: 'Inactive'},
  { storename: 'Enéas Kwadwo', registered: '2012/03/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Pending'},
  { storename: 'Agapetus Tadeáš', registered: '2012/01/21',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Active'},
  { storename: 'Carwyn Fachtna', registered: '2012/01/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Active', _classes: 'table-success'},
  { storename: 'Nehemiah Tatius', registered: '2012/02/01',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Banned'},
  { storename: 'Ebbe Gemariah', registered: '2012/02/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Đồ uống', status: 'Inactive'},
  { storename: 'Eustorgios Amulius', registered: '2012/03/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Pending'},
  { storename: 'Leopold Gáspár', registered: '2012/01/21',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Active'},
  { storename: 'Pompeius René', registered: '2012/01/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Active'},
  { storename: 'Paĉjo Jadon', registered: '2012/02/01',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Banned'},
  { storename: 'Micheal Mercurius', registered: '2012/02/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Đồ uống', status: 'Inactive'},
  { storename: 'Ganesha Dubhghall', registered: '2012/03/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Pending'},
  { storename: 'Hiroto Šimun', registered: '2012/01/21',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Active'},
  { storename: 'Vishnu Serghei', registered: '2012/01/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Active'},
  { storename: 'Zbyněk Phoibos', registered: '2012/02/01',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Banned'},
  { storename: 'Einar Randall', registered: '2012/02/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Đồ uống', status: 'Inactive', _classes: 'table-danger'},
  { storename: 'Félix Troels', registered: '2012/03/21',owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Thức ăn nhanh,', status: 'Active'},
  { storename: 'Aulus Agmundr', registered: '2012/01/01', owner: 'Pha Nhat Tan' , type: 'Đồ uống' , address: ' 455 phuong 1 quan 1 TP.HCM' , opentime : '9 AM', closetime:'20PM ', rating: '4.5' , type: 'Nhà hàng,', status: 'Pending'}
]

export default usersData


