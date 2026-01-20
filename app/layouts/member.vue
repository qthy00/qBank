<template>
  <Suspense>
    <template #default>
      <div class="bg-gray-50">
        <Navbar />

        <UserHeader/>

        <UserSideBar>
          <slot/>
        </UserSideBar>
        <Footer/>
      </div>
    </template>
    <template #fallback>
      <div class="flex justify-center items-center h-screen">
        <div>页面加载中。。。</div>
      </div>
    </template>
  </Suspense>
</template>
