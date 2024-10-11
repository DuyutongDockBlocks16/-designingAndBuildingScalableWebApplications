<script>
    import Invatation from "./Invatation.svelte";
    let name = "Bob";

    let letter = "";

    if (name === "Alice"){
        letter = "We cordially invite you to the party!";
    } else if (name === "Bob"){
        letter = "The time is nigh!";
    }
</script>

<Invatation {name}>
    {letter}
</Invatation>