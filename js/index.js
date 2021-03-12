$(document).ready(function(){


const visited = (src,dest) =>{
  for(const property in pages){
    console.log(property);
  }
};

const tip = $(".tip");
const testing = $(".title-recipe");
const container = $(".container");
let categories=[];
let menu={};
let modal = $("#myModal");

const addHover = ()=>{
    tip.removeClass("w-100");
    tip.addClass("w-30");
    tip.hover(
      function () {
        $(this).removeClass('w-30');
        $(this).children().animate({
          width: '50%',
          },'slow');
        $(this).animate({
          width: '100%',
          color:'pink',
          },'slow');
        },
      function () {
        $(this).children().animate({
          width: '100%',
          },'slow');
        $(this).animate({
          width: '30%',
          });
        }
    );
}

const mobile = ()=>{
  tip.removeClass("w-30");
  tip.addClass("w-100");
  $(".tipIn").addClass("w-100");
}

if($(window).width()>800){
  addHover();
}else{
  mobile();
}

$(window).resize(()=>{
  $(window).width()>800?addHover():mobile();
});

$(".burger").click(function(){
$(".dropContent").slideToggle("fast");
return false;
});

const display = (elem)=>{
  let id= elem.strMeal.split(" ");

  id.length>1?id=id[0].concat("-"+id[1]):id=id[0];
  let shortIns = elem.strInstructions.substring(0,80);
  let img = elem.strMealThumb;

    testing.after(`
              <div class="recipe-card ${elem.strCategory} clickme" id=${id} data-aos="zoom-in-left">
                <img src="${img}" id=${id} alt="${elem.strMeal}" />
                <div class="text" id=${id}>
                  <h5 id=${id}>${elem.strMeal}</h5>
                  <div class="desc" id=${id}>
                    <p id=${id}>${shortIns} ...</p>
                  </div>
                </div>
              </div>
    `);
};

$("#filter").click(()=>display);

const preview = (elem)=>{
  let id= elem.strMeal.split(" ");
  id.length>1?id=id[0].concat("-"+id[1]):id=id[0];
  let shortIns = elem.strInstructions.substring(0,80);
  let img = elem.strMealThumb;
    container.append(`
          <div class="recipe-card clickme" id="${id}" data-aos="fade-left">
            <img src="${img}" id=${id} alt="${elem.strMeal}" />
            <div class="text" id=${id}>
              <h5 id=${id}>${elem.strMeal}</h5>
              <div class="descrip">
                <p id=${id}>${shortIns} ...</p>
              </div>
            </div>
          </div>
    `);
};


const unique = (array)=>{
  // let sort
  // $(window).width()<=800?sort=$("#sortTop"):sort=$("#sort");
  let uniqueArray = [...new Set(array)];
  $(".sortCont").append(`
    <li><p><a class="sort" id="reset">Reset</a></p></li>
  `);
  uniqueArray.map((x)=>{
    $(".sortCont").append(`
      <li><p><a class="sort" id="${x}">${x}</a></p></li>
  `);
  });
}

const timeout = async ms => new Promise(res => setTimeout(res, ms));
let next = false;
let samp;
let test = false;
let hel = "hello";

const lookUp = (id)=>{
  return menu.filter((x)=>{
    return x.strMeal === id;
  });
}

  let name = $("#name");
  let ingredients = $("#ingredients");
  let procedure = $("#procedure");
  let val = [];
  let meas = [];
  let ingList = [];
  let measure = [];

const displayRecipe = (data)=>{
  val = [];
  meas = [];
  ingList = [];
  measure = [];

  for(x=1;x<=25;x++){
    val.push("strIngredient"+x);
    meas.push("strMeasure"+x);
  }

  val.filter((x)=>{
     for(let y in data){
      if(y===x){
        (data[y]!=""&&data[y]!=" ")&&ingList.push(data[y]);
      }
    }
  });

  meas.filter((x)=>{
     for(let y in data){
      if(y===x){
        (data[y]!=""&&data[y]!=" ")&&measure.push(data[y]);
      }
    }
  });

  try {
    name.text(data.strMeal);

    $(".ingredient").children().remove();
    $(".measurement").children().remove();

    ingList.map(x=>{
      $(".ingredient").append(`
        <p class="ing">${x}</p>
      `);
    });

    measure.map(x=>{
      $(".measurement").append(`
        <p class="meas">${x}</p>
      `);
    });

    procedure.text(data.strInstructions);

    $("#yt").attr("href",data.strYoutube);
    $("#source").attr("href",data.strSource);
  } catch (e) {
    name.text("Error Occured");
    $(".ingredient").children().remove();
    $(".measurement").children().remove();
    $(".procedure").text("");
    $(".ingredient").append(`
        <p class="ing">Sorry For the Inconvenience Please Reload the Page</p>
    `);
  }

};

const newId = (old)=>{
  let newId = old.split("-");
  newId.length>1?newId=newId[0].concat(" "+newId[1]):newId=newId[0];
  return newId;
};


  $(function(){
    $.ajax({
      type:"GET",
      url:"https://www.themealdb.com/api/json/v1/1/search.php?s=",
      success:(meal)=>{
        menu=meal.meals;
        menu.map((x)=>{
          categories.push(x.strCategory);
        });
        unique(categories);
        if(testing.length>0){
          $.each(menu,(i,elem)=>{
            display(elem);
          });

          $(".clickme").click((event)=>{
            let data;
            modal.css("display","block");
            data =newId(event.target.id);
            data=lookUp(data);
            displayRecipe(data[0]);
          });
        }else{
          for(let ctr=0;ctr<4;ctr++){
            preview(menu[ctr]);
          }
          $(".clickme").click((event)=>{
            let data;
            modal.css("display","block");
            data =newId(event.target.id);
            data=lookUp(data);
            displayRecipe(data[0]);
          });
        }

      }
    });
  });
  $("p.close").click (()=>{
    let ingredients = $(".ingredient");
    let procedure = $(".measurement");
    // procedure.children().empty();
    modal.css("display","none");
  });

  const sortList = (cat)=>{
    let found = menu.filter((x)=>{
      return x.strCategory === cat;
    });
    if(found.length >0){
      testing.siblings().length > 0&&testing.siblings().empty();
      found.map((x)=>{
        display(x);
          $(".clickme").click((event)=>{
            let data;
            modal.css("display","block");
            data =newId(event.target.id);
            data=lookUp(data);
            displayRecipe(data[0]);
          });
      });
    }else{
      menu.map(function(x){
        display(x);
          $(".clickme").click((event)=>{
            let data;
            modal.css("display","block");
            data =newId(event.target.id);
            data=lookUp(data);
            displayRecipe(data[0]);
          });
      });
    }
  };

  $("#slide").fadeIn("slow");

  $(".filt").click(function(){
    $(".side-nav").slideToggle("fast");
    $(".sort").click(
      function(){
        sortList($(this).attr("id"));
      }
    );
  });
  $(".dropFilt").click(function(){
    $(".filtCat").slideToggle("fast");
    $(".sort").click(
      function(){
        sortList($(this).attr("id"));
      }
    );
  });

  $(window).click((event)=>{
    if(event.target==modal[0]){
      modal.css("display","none");
    }
  });

});
