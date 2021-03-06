//build whole profile
function build_dive(){
  a9 = 0;
  b9 = 0;
  tmp_lvl_arr = [];
  tmp_lvl_mix_arr = [];

  var rate_asc = document.getElementById("opt_rate_asc");
  var rate_asc_idx = rate_asc.options[rate_asc.selectedIndex].value;
  var rate_dsc = document.getElementById("opt_rate_dsc");
  var rate_dsc_idx = rate_dsc.options[rate_dsc.selectedIndex].value;

  //calculate ascending numbers for potentialy deco stops
  for (i = 0; i < lvl_arr.length/3; i++) {
    if(i > 0){
        //console.log("all_as_fine_ASCENT");
      //if ascend you need build potentialy deco levels
      if(lvl_arr[a9+1]*1.0 < lvl_arr[a9-2]*1.0){
        del_to_depth = lvl_arr[a9+1]*1.0;

        out_segment = build_dive_segment(tmp_lvl_arr , tmp_lvl_mix_arr, 0);

        //Delete from end to next lvl all levels after
        for (f = out_segment.length-1; f >= 0; f--) {
          if(out_segment[f].startDepth < del_to_depth){
            out_segment.splice(f,1);
          }
        }
        //Delete all Ascent\Descent
        for (z = 0; z < out_segment.length; z++) {
          //fix very short ascent segments one by one. Delete using second pass.
          for (f = 0; f < out_segment.length; f++) {
            if(out_segment[f].startDepth != out_segment[f].endDepth){
              out_segment.splice(f,1);

            }
          }

        }
        //Delete all levels from start
        out_segment.splice(0,tmp_lvl_arr.length/3);
        //console.log(out_segment);
        //Everything is almost ready for add extra deco stops if exist
        for (f = 0; f < out_segment.length; f++) {

          tmp_lvl_arr.push(tmp_lvl_arr.length/3+1 , out_segment[f].startDepth , out_segment[f].time);
          ret_mix = gass_from_name_arr(out_segment[f].gasName);
          tmp_lvl_mix_arr.push(ret_mix[0],ret_mix[2]);
        }
        //Add next level after adding potentialy decostops lvl`s
        tmp_lvl_arr.push(tmp_lvl_arr.length/3+1 , lvl_arr[a9+1]*1.0 , lvl_arr[a9+2]*1.0);
        tmp_lvl_mix_arr.push(lvl_mix_arr[b9]*1.0 , lvl_mix_arr[b9+1]*1.0);
      }
      else
      {
          tmp_lvl_arr.push(tmp_lvl_arr.length/3+1 , lvl_arr[a9+1]*1.0 , lvl_arr[a9+2]*1.0);
        tmp_lvl_mix_arr.push(lvl_mix_arr[b9]*1.0 , lvl_mix_arr[b9+1]*1.0);
      }
    }
    else
    {
      tmp_lvl_arr.push(lvl_arr[a9]*1.0 , lvl_arr[a9+1]*1.0 , lvl_arr[a9+2]*1.0);
      tmp_lvl_mix_arr.push(lvl_mix_arr[b9]*1.0 , lvl_mix_arr[b9+1]*1.0);

    }
    a9 = a9 + 3;
    b9 = b9 + 2;
  }

  //if last last segment above 7 meters. This code does`t work korect with no deco segments and
  //zacominchen:))
  if(tmp_lvl_arr[tmp_lvl_arr.length -2]*1.0 < 7){

   output = build_dive_segment(tmp_lvl_arr , tmp_lvl_mix_arr, 0);

  }
  else
  {
    //compute regular dive under 6 meters last lvl
    output = build_dive_segment(tmp_lvl_arr , tmp_lvl_mix_arr, 0);

  }
  return output;
}
//main function to build any dive segment
function build_dive_segment(levels_segment_arr , levels_mix_segment_arr, lst_sgm_dive){

  var rate_asc = document.getElementById("opt_rate_asc");
  var rate_asc_idx = rate_asc.options[rate_asc.selectedIndex].value;

  var rate_dsc = document.getElementById("opt_rate_dsc");
  var rate_dsc_idx = rate_dsc.options[rate_dsc.selectedIndex].value;
  var output = [];

    if(max_lvl_depth(levels_segment_arr) < 7){
      //Not Deco Dive Segment

      tmp_arr = [];
      tmp_end_depth = levels_segment_arr[1];
      tmp_time = (levels_segment_arr[0+1]*1.0/rate_dsc_idx)*1.0;
      tmp_mx_arr =[];
      tmp_mx_arr.push(levels_mix_segment_arr[0],levels_mix_segment_arr[1]);
      tmp_gass_name = mix_to_txt_arr(tmp_mx_arr);

      //add first descent lvl
      tmp_arr.push(
        {
          endDepth: tmp_end_depth,
          startDepth: 0,
          time: tmp_time,
          gasName: tmp_gass_name
        }
      );
      //loop for all added levels
      a3 = 0;
      b3 = 0;
      for (i = 0; i < levels_segment_arr.length/3; i++) {
        //for every flat levels
        tmp_end_depth = levels_segment_arr[a3+1];
        tmp_start_depth = levels_segment_arr[a3+1];
        tmp_time = levels_segment_arr[a3+2];
        tmp_mx_arr =[];
        tmp_mx_arr.push(levels_mix_segment_arr[b3],levels_mix_segment_arr[b3+1]);
        tmp_gass_name = mix_to_txt_arr(tmp_mx_arr);

        tmp_arr.push(
          {
            endDepth: tmp_end_depth,
            startDepth: tmp_start_depth,
            time: tmp_time,
            gasName: tmp_gass_name
          }
        );
          //add lvl change.if it is not last change
          if(levels_segment_arr[a3+4] !== undefined){
            tmp_end_depth = levels_segment_arr[a3+4]*1.0;
            tmp_start_depth = levels_segment_arr[a3+1]*1.0;

            //compute travel time from one to next lvl
            tt_time = Math.abs(tmp_start_depth - tmp_end_depth);
            if(tmp_start_depth - tmp_end_depth < 0){
              tmp_time = (tt_time*1.0/rate_dsc_idx);
            }
            else
            {
              tmp_time = (tt_time*1.0/rate_asc_idx);
            }
            //retirn char mix name
            tmp_mx_arr =[];
            tmp_mx_arr.push(levels_mix_segment_arr[b3],levels_mix_segment_arr[b3+1]);
            tmp_gass_name = mix_to_txt_arr(tmp_mx_arr);

            tmp_arr.push(
              {
                endDepth: tmp_end_depth,
                startDepth: tmp_start_depth,
                time: tmp_time,
                gasName: tmp_gass_name.toString()
              }
            );
          }

        b3 = b3 + 2;
        a3 = a3 + 3;
      }

      //add last lvl to surface
      tmp_time = ((tmp_arr[tmp_arr.length-1].endDepth)*1.0/rate_asc_idx)*1.0;
      tmp_arr.push(
        {
          endDepth: 0,
          startDepth: tmp_arr[tmp_arr.length-1].endDepth,
          time: tmp_time,
          gasName: tmp_arr[tmp_arr.length-1].gasName
        }
      );
      output = tmp_arr;
    }
    else

    //Deco Dive_Segment! 
    {
        //reset compartment info array every graph rebuild
        comp_tiss_arr =[];

    //reset previos plan
    var plan = [];
    var mdl = document.getElementById("tn_mdl");
    var mdl_idx = mdl.options[mdl.selectedIndex].value;
    var buhlmann = dive.deco.buhlmann();
    vpm = dive.deco.vpm();
    //Select algorithm
    if(mdl_idx == 1){
      plan = new buhlmann.plan(buhlmann.ZH16ATissues);
    }
    if(mdl_idx == 2){
      plan = new buhlmann.plan(buhlmann.ZH16BTissues);
    }
    if(mdl_idx == 3){
      plan = new buhlmann.plan(buhlmann.ZH16CTissues);
    }
    if(mdl_idx == 4){
      plan = new vpm.plan(1,true);
    }

    //Add Bottom/travel gases
    aaa = 0;
    for(c = 0 ; c < levels_mix_segment_arr.length/2 ; c++){
      ff = [levels_mix_segment_arr[aaa] , levels_mix_segment_arr[aaa+1]];
      //alert(mix_to_txt_arr(ff));
      plan.addBottomGas(mix_to_txt_arr(ff), levels_mix_segment_arr[aaa]*0.01, levels_mix_segment_arr[aaa+1]*0.01);
      //console.log(mix_to_txt_arr(ff));

      aaa = aaa + 2;
    }

    //Add deco gases
    var mix_deco = document.getElementById("opt_deco");
    var mix_deco_idx = mix_deco.options[mix_deco.selectedIndex].value;
    aaa = 0;
    for(c = 0 ; c < mix_deco_idx ; c++){
      tmp3 =[deco_mix_arr[aaa],deco_mix_arr[aaa+1]];
      plan.addDecoGas(mix_to_txt_arr(tmp3), deco_mix_arr[aaa]*0.01, deco_mix_arr[aaa+1]*0.01);
      //as Bottom/Travel gases, for lvl compatibility
      plan.addBottomGas(mix_to_txt_arr(tmp3), deco_mix_arr[aaa]*0.01, deco_mix_arr[aaa+1]*0.01);
      aaa=aaa+2;
    }

    //Add lvl changes
    //Get current ascending deco speed
    aaa = 0;
    fff = 0;
    for(c = 0 ; c < levels_mix_segment_arr.length/2 ; c++){
      ff = [levels_mix_segment_arr[aaa] , levels_mix_segment_arr[aaa+1]];
      if(c === 0){
        tmp_time = levels_segment_arr[fff+1]*1.0/rate_dsc_idx;
        plan.addDepthChange(0, levels_segment_arr[fff+1]*1.0, mix_to_txt_arr(ff), tmp_time*1.0);
        plan.addDepthChange(levels_segment_arr[fff+1]*1.0, levels_segment_arr[fff+1]*1.0, mix_to_txt_arr(ff), levels_segment_arr[fff+2]*1.0);
      }
      else
      {
        if(((levels_segment_arr[fff+1-3]*1.0) - (levels_segment_arr[fff+1]*1.0))>= 0){
          tmp_time = (Math.abs((levels_segment_arr[fff+1-3]*1.0) - (levels_segment_arr[fff+1]*1.0)))/rate_asc_idx;
        }
        else
        {
          tmp_time = (Math.abs((levels_segment_arr[fff+1-3]*1.0) - (levels_segment_arr[fff+1]*1.0)))/rate_dsc_idx;
        }
        //fix lib crush because time can`t == 0;
        if(tmp_time === 0){
          tmp_time = 0.001;
        }
        plan.addDepthChange(levels_segment_arr[fff+1-3]*1.0, levels_segment_arr[fff+1]*1.0, mix_to_txt_arr(ff), tmp_time);
        plan.addDepthChange(levels_segment_arr[fff+1]*1.0, levels_segment_arr[fff+1]*1.0, mix_to_txt_arr(ff), levels_segment_arr[fff+2]*1.0);
      }
      aaa = aaa + 2;
      fff = fff + 3;
    }

    var ppo2_deco = document.getElementById("opt_ppo2_deco");
    var ppo2_deco_idx = ppo2_deco.options[ppo2_deco.selectedIndex].value;

    //fix computation GF error with zero
    if(gf_arr[0] === 0){
      gf_arr[0] = 1;
    }
    //compute END for specific lib param
    var ppn2_max_deco = document.getElementById("opt_ppn2_max_deco");
    ppn2_max_deco_idx = ppn2_max_deco.options[ppn2_max_deco.selectedIndex].value;
    mxis_end = (((parseFloat(ppn2_max_deco_idx))/0.79)-1)*10;

      //ERROR!
    output = plan.calculateDecompression(false, gf_arr[0]*0.01, gf_arr[1]*0.01, ppo2_deco_idx*1.0, mxis_end);

    }
    //console.log(output);
    //fix ascent error on very short dives
    for(c = 0 ; c < output.length ; c++){
      if(output[c].endDepth < 0){
        output[c].endDepth = 3;
        output.push(
          {
            endDepth: 0,
            startDepth: output[c].endDepth,
            time: output[c].time,
            gasName: output[c].gasName
          }
        );
      }
    }
    /*for(c = 1 ; c < output.length ; c++){
      
      
      if(output[c].startDepth == 6 && output[c].endDepth === 0){
        
      console.log(output[c].startDepth);
      console.log(output);
      output[c].endDepth = 3;
      output[c].time = output[c].time/2;
          output.push(
          {
            endDepth: 0,
            startDepth: 3,
            time: output[c].time,
            gasName: output[c].gasName
          }  
        );
      
    }
    }*/
    //ADD extra stops for gas changing
    tn_cng_time = document.getElementById("opt_cng_time");
    tn_cng_time_idx = parseInt(tn_cng_time.options[tn_cng_time.selectedIndex].value);

    //if changing mix time === 0 we need add some time for property dive plan computation.
    if(tn_cng_time_idx === 0)
    {
      tn_cng_time_idx = 0.01;
    }

    for(c = 1 ; c < output.length ; c++){
      if(output[c].gasName != output[c-1].gasName){
        output.splice(c,0,
          {
            endDepth: output[c].startDepth,
            startDepth: output[c].startDepth,
            time: tn_cng_time_idx,
            gasName: output[c].gasName
          }
        );
      }
    }
    //console.log(output);
    return output;
  }

//from idx filtered array make only fraction o2\he from real travel gases array
function get_rl_fraction(idx_arr){
  var mix_travel_idx = mix_travel.options[mix_travel.selectedIndex].value;
  tmp_arr=[];
  a=0;
  b=0;
  for(c = 0 ; c < mix_travel_idx ; c++){
    if(c == idx_arr[a]){
      tmp_arr.push(travel_mix_arr[b],travel_mix_arr[b+1]);
      a=a+1;
    }
    b=b+2;
  }
  return tmp_arr;
}
//return depth range, for selected by idx, mix array. Only two min max number
function ret_mix_range(idx , tmp_mix_arr){

  var ppo2_bottom = document.getElementById("opt_ppo2_bottom");
  var ppo2_min = document.getElementById("opt_ppo2_min");
  var ppn2_max = document.getElementById("opt_ppn2_max");

  var ppo2_bottom_idx = ppo2_bottom.options[ppo2_bottom.selectedIndex].value;
  var ppo2_min_idx = ppo2_min.options[ppo2_min.selectedIndex].value;
  var ppn2_max_idx = ppn2_max.options[ppn2_max.selectedIndex].value;
  tmp_arr=[];
  a = 0;
  for(c = 0 ; c < tmp_mix_arr.length ; c++){
    if(c+1 == idx){
      dp_o2_max = (ppo2_bottom_idx/(tmp_mix_arr[a]*0.01)*10) - (10*height_to_bar())*1.0;



      dp_o2_min = (ppo2_min_idx/(tmp_mix_arr[a]*0.01)*10 - (10*height_to_bar()))*1.0;
      if(dp_o2_min < 1){dp_o2_min = 1;}
      if(dp_o2_min == Infinity){dp_o2_min = 1;}
      dp_ppn2_max = (ppn2_max_idx/((100-tmp_mix_arr[a]-tmp_mix_arr[a+1])*0.01)*10) - (10*height_to_bar())*1.0;

      //alert(dp_o2_min);
      tmp_arr.push(dp_o2_min);
      if (dp_ppn2_max >= dp_o2_max){
        tmp_arr.push(dp_o2_max);
      }
      else
      {
        tmp_arr.push(dp_ppn2_max);
      }
      break;
    }
    a=a+2;
  }
  //alert(tmp_arr)
  return tmp_arr;
}
function upd_lvl_opt_arr(){
  //check if level time changed then write to lvl_arr and update interface
  a = 2;
  for(j = 0 ; j < (lvl_arr.length/3) ; j++){
   //code
   tmp = document.getElementById("opt_levels_time_" + j);
   lvl_tm_c = parseInt(tmp.options[tmp.selectedIndex].value);

   //if time === 0 then make some time on levels for correct computation. one second
   if(lvl_tm_c  === 0){
       lvl_tm_c = 0.01;
   }
    if(lvl_arr[a]!= lvl_tm_c){
      lvl_arr[a] = lvl_tm_c;
      break;
    }
   a=a+3;
  }

  //for depth
  a = 1;
  for(j = 0 ; j < (lvl_arr.length/3) ; j++){
   //code
   tmp = document.getElementById("opt_levels_depth_" + j);
   lvl_tm_c = tmp.options[tmp.selectedIndex].value;
    if(lvl_arr[a]!= lvl_tm_c){
      lvl_arr[a]=lvl_tm_c;
      lvl_arr.length = a+2;
      break;
    }
   a=a+3;
  }

  //and for mix
  a = 0;
  for(j = 0 ; j < (lvl_arr.length/3) ; j++){
   tmp = document.getElementById("opt_levels_mix_" + j);
   lvl_mx_c = tmp.options[tmp.selectedIndex].value;
    b = Math.floor(lvl_mx_c)+1.0;
    if(lvl_arr[a]!= b){
      lvl_arr[a]=b;
      lvl_arr.length = a+3;
      break;
    }
   a=a+3;
  }
  //upd_lvl_list();
  upd_all();
}

// Compute altitude in meters to preassure in bars
function height_to_bar(){
  sea_lvl_merc = 750.062;

  tn_celsus1 = document.getElementById("opt_celsus");
  t_celsus = parseFloat(tn_celsus1.options[tn_celsus1.selectedIndex].value);
  tn_slevel1 = document.getElementById("opt_slevel");
  height_mtr = parseFloat(tn_slevel1.options[tn_slevel1.selectedIndex].value);

  t_kelvin = 273.15 + (t_celsus);
  prs_mercury = (Math.pow(2.7182818 , (((0.02896*9.807)/(8.3143*t_kelvin)*-1)*(height_mtr))))*(sea_lvl_merc);
  //alert(prs_mercury);
  prs_bars = prs_mercury*0.00133322;
  return prs_bars;
}



  //Dec time equalation to real time format xx:xx
  function time_dec_to_time(tmp_time){
    tmp_time_hi = Math.floor(tmp_time);
    tmp_time_lo = (((tmp_time*100) - (tmp_time_hi*100))*0.6)*0.01;
    //fix javascript bug
    if(tmp_time_lo >= 0.59){tmp_time_lo = 1.0}
    tmp_time = (tmp_time_hi+tmp_time_lo).toFixed(2);
    tmp_time = tmp_time.replace( "." , ":");
    return tmp_time;
  }

  //Recombine output plan to five column table format
function src_to_5_arr(tmp_arr){

  tmp_arr = zero_lvl_arr(tmp_arr);
  dec_table = to_5_column_arr(tmp_arr);

  //fix tissue error on very short dive plans
  tn_lst_stop1 = document.getElementById("opt_lst_stop");
  tn_lst_stop1_idx = parseFloat(tn_lst_stop1.options[tn_lst_stop1.selectedIndex].value);
  test_dp = depth_from_name_arr(dec_table[dec_table.length - 9]);


  //fix gass swich error on exit for very short dive plans
  dec_table[(dec_table.length-1)] = dec_table[(dec_table.length-6)];
  return dec_table;
}

  //remove_zero time levels from plan. It is normal because user can asign lvl same depth
  function zero_lvl_arr(tmp_arr){
    for (i = 0; i < tmp_arr.length; i++){
      if(tmp_arr[i].time <= 0.001){
        tmp_arr.splice(i,1);
      }
    }
    //if levels have same depth and gass name - glue it to one level
    for (i = 0; i < tmp_arr.length-1; i++){
      if(tmp_arr[i].startDepth == tmp_arr[i+1].startDepth){
        if(tmp_arr[i].endDepth == tmp_arr[i+1].endDepth){
          if(tmp_arr[i].gasName.toString() == tmp_arr[i+1].gasName.toString()){
            tmp_arr[i].time = (tmp_arr[i].time*1.0)+(tmp_arr[i+1].time*1.0);
            tmp_arr.splice(i+1,1);
            i=i-1;
          }
        }
      }
    }
    return tmp_arr;
  }
  //add table different info
  function to_5_column_arr(tmp_arr){
    dec_table = ["Action" , "Depth" , "Time" , "RunTime" , "Mix"];

    runtime = 0;
    for (var i = 0; i < tmp_arr.length; i++) {


      dp_end1 = tmp_arr[i].endDepth*1.0;
      dp_start1 = tmp_arr[i].startDepth*1.0;
      dp_c_time = tmp_arr[i].time*1.0;
      dp_c_mix = tmp_arr[i].gasName;
      runtime = runtime + (dp_c_time);

      if(dp_end1 == dp_start1){

        if(((lvl_arr.length/3)*2) > i){
          dec_table.push("Level");
        }
        else
        {
          dec_table.push("Stop");
        }
      }
      if(dp_end1 < dp_start1){
          dec_table.push("Ascent");
      }
      if(dp_end1 > dp_start1){
        dec_table.push("Descent");
      }
      if(dp_start1 == dp_end1){
        dec_table.push(dp_start1);
      }
      else
      {
        dec_table.push(dp_start1 + "-" + dp_end1);
      }
      dec_table.push(time_dec_to_time(dp_c_time));
      dec_table.push("(" + time_dec_to_time(runtime) +")");
      dec_table.push(dp_c_mix);
    }
    return dec_table;
  }