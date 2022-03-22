<template>
  <footer>
    <a
      href="https://www.youtube.com/channel/UCYXoautmTvZFuU1Lj6XLJ8Q"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="@/assets/Youtube.webp" />
    </a>
    <a
      href="https://discord.gg/zfyKB7d"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="@/assets/Discord.webp" />
    </a>
    <a
      href="https://www.facebook.com/InsightZ3D/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="@/assets/Facebook.webp" />
    </a>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
footer {
  background: var(--secondary);
  padding: 15px 0;
  text-align: center;
  font-size: 1.2rem;
  color: var(--text-primary);
  position: relative;
  top: 75px;
  display: flex;
  align-content: center;
  justify-content: center;
  gap: 20px;
}
</style>