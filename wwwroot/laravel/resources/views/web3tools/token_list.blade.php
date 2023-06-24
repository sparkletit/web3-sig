
<div class="d-inline-flex" >

<!-- <span class="btn btn-sm btn-info d-inline-flex">
<i class="icon-filter"></i>Select Token:
</span> -->

<span class="d-inline-flex ms-1">    
    <select id="tokenpicker" class="form-select form-select-sm " >
        <option  value="0">Select Token</option>
        @foreach($tokenlist as $item)
            <option  value="{{$item->address}}">{{$item->chain}}--{{$item->name}}</option>
        @endforeach                        
    </select>
</span>


</div> 

<script>
    var $_GET = (function(){
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();
 document.querySelector('select').value =$_GET['token'];
</script>