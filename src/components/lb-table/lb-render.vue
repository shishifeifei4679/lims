<script>
export default {
  name: "LbRender",
  functional: true,
  props: {
    scope: Object | Array,
    render: Function
  },
  render: (h, ctx) => {
    return ctx.props.render ? ctx.props.render(h, ctx.props.scope) : ""
  }
}
</script>
