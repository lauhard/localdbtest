<script lang="ts">
    import SubMenu from "./SubMenu.svelte";
    let {children, data} = $props();
    console.log("clientdetail layout id", data.client.id);
    let clientId = $state(data.client.id);
</script>

<SubMenu {clientId} ></SubMenu>
<h3 class="mt-2 text-2xl font-bold text-base-content mb-2">
    {data.client.firstname}
    {data.client.lastname}
</h3>
{@render children()}
