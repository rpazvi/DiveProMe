

var tn_gf_lo = document.getElementById("tn_gf_lo_opt");
var tn_gf_hi = document.getElementById("tn_gf_hi_opt");
tn_gf_lo.addEventListener('change', upd_gf);
tn_gf_hi.addEventListener('change', upd_gf);

function upd_gf(){
  mdl = document.getElementById("tn_mdl");
  mdl_idx = mdl.options[mdl.selectedIndex].value;

  //support to vpm model/ Need rewrite!
  if(mdl_idx == 1){
    rest_gf();
    
  }
  
    tn_gf_lo = document.getElementById("tn_gf_lo_opt");
    tn_gf_hi = document.getElementById("tn_gf_hi_opt");
    tn_gf_lo_idx = tn_gf_lo.options[tn_gf_lo.selectedIndex].value;
    tn_gf_hi_idx = tn_gf_hi.options[tn_gf_hi.selectedIndex].value;
  
    del_html_elem("tn_gf");
    if(tn_gf_lo_idx*1.0 != gf_arr[0]){
      gf_arr[0] = tn_gf_lo_idx*1.0;
      if(tn_gf_lo_idx*1.0 >= gf_arr[1]){
         gf_arr[0] = gf_arr[1]-1;
      }
    }
    if(tn_gf_hi_idx*1.0 != gf_arr[1]){
      gf_arr[1] = tn_gf_hi_idx*1.0;
      if(tn_gf_hi_idx*1.0 <= gf_arr[0]){
         gf_arr[1] = gf_arr[0]+1;
      }
    }
    create_option("tn_gf", "tn_gf_lo_opt", 0, 100, gf_arr[0], 1 , 0);
    create_option("tn_gf", "tn_gf_hi_opt", 0, 100, gf_arr[1], 1 , 0);
  
    tn_gf_lo = document.getElementById("tn_gf_lo_opt");
    tn_gf_hi = document.getElementById("tn_gf_hi_opt");
    tn_gf_lo.addEventListener('change', upd_gf);
    tn_gf_hi.addEventListener('change', upd_gf);

  upd_all();
}

function rest_gf(){
  /*
  changeLang("force");
  changeLang();
  create_option("tn_gf", "tn_gf_lo_opt", 0, 100, gf_arr[0], 1 , 0);
  create_option("tn_gf", "tn_gf_hi_opt", 0, 100, gf_arr[1], 1 , 0);
  */
}
