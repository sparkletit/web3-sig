<div class="d-inline-flex" >

<span class="btn btn-sm btn-info d-inline-flex">
<i class="icon-filter"></i>Select Token:
</span>

<span class="d-inline-flex ms-1">    
    <select id="tokenpicker" class="form-select form-select-sm " >
        @foreach($tokenlist as $item)
            <option  value="{{$item->address}}">{{$item->chain}}--{{$item->name}}</option>
        @endforeach                        
    </select>
</span>


</div> 

