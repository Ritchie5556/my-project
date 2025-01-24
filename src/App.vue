<template>
  <div id="app">
    <header>
      <h1>3D Model Viewer</h1>
    </header>
    <main>
      <ModelViewerContainer />  <!-- Updated name here -->
    </main>
  </div>
</template>

<script>
import ModelViewerContainer from './components/ModelViewer.vue'

export default {
  name: 'App',
  components: {
    ModelViewerContainer  // Make sure the name matches here
  }
}
</script>
