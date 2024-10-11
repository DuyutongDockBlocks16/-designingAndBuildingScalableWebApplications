<script>
    import Editor from "./Editor.svelte";
    let texts = [];

    const addtext = (text) => {
        texts = [...texts,text]
    }


</script>

<Editor addtext = {addtext} />

<ul>
    {#each texts as text}
        <li>{text}</li>
    {/each}
</ul>