<?php
/*
 *  shuffman.com | Scott C Huffman | August 2016
 *  plans:
 *  - Index Scroll Bar
 *	- Blog page
 *	- Browser History and url manipulation
 *  - Add little animations, like fade in on page load
 *  - Add big bmth like animation on side side bars
 */
?>
<!DOCTYPE html>
<html lang=en >
	<head>
		<meta charset=UTF-8 >

		<?php require_once('posts.php') ?>

		<title>Scott Huffman | Development &amp; Design</title>

		
		<meta id="meta" name="viewport" content="width=device-width, initial-scale=1.0"/>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>

		<link href='https://fonts.googleapis.com/css?family=Josefin+Sans:400,300,100,300italic' rel='stylesheet' type='text/css'>
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
		<link href="css/style.css" rel="stylesheet" type="text/css" />

		<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
		<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
		<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
		<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
		<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
		<link rel="manifest" href="/manifest.json">
		<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#fc653b">
		<meta name="msapplication-TileColor" content="#171717">
		<meta name="msapplication-TileImage" content="/mstile-144x144.png">
		<meta name="theme-color" content="#171717">

		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="format-detection" content="telephone=no">

		<meta name="apple-mobile-web-app-title" content="Scott Huffman">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

	</head>

	<body>
		<?php if(isset($_GET["blog"])): ?>
			<script>
				$(window).load(function() {
					$('#blog').addClass('category-button-selected');
					$('#blogPanel').addClass('category-button-selected');
					$('#portfolio').removeClass('category-button-selected');

					$('#portfolio-area').fadeOut(250, function(){ $('#blog-area').fadeIn(250); });
				});

			</script>
		<?php endif; ?>
		<div class="left-border"></div><div class="wrap">
			<div class="column-1">
				<header class="title main-title">
					<h1>Scott Huffman</h1>
					<h2><span style="color:#FC653B;">[</span>development <span style="color:#FC653B;">&amp;</span> design<span style="color:#FC653B;">]</span></h2>
					<p class = "other-menu-button"><a class="menu-link" href="https://github.com/canderis">github</a> <a class="menu-link" href="http://canderis.com/">canderis</a> <a class="menu-link" href = "mailto:scott@shuffman.com?Subject=Website%20Contact" target="_top"> contact</a></p>
				</header>
				<div class="title-bar-buttons">
					<?php /*
					<div class="category-button title-bar-button" id = "blog">
						<div class="title button-title">
							<h3 class="category-button-heading">blog <i class="material-icons searchBtn">search</i> </h3> 
						</div>
					</div>*/?><div class="button-padding" style="width: calc(100% - 240px);"></div><div class="category-button title-bar-button" id="portfolio">
						<div class="title button-title" style="margin-left: 20px;">
							<h3 class="category-button-heading">portfolio</h3>
						</div>
					</div>
				</div>
			</div><div class="column-2">
			<?php /*
				<div class="category-button" id = "blogPanel">
					<div class="title button-title">
						<h3 class="category-button-heading">blog</h3>
					</div>
				</div>
				*/?>
				<div class="category-button portfolio" id="portfolioPanel" style="margin-top:0; height: 100%;">
					<div class="title button-title">
						<h3 class="category-button-heading">portfolio</h3>
					</div>
				</div>
			</div>
			<div class="content-area">
				<div class="content-list" id="blog-area"><?php processPosts('blog.php'); ?></div>
				<div class="content-list" id="portfolio-area">
					<?php processLinks('portfolio.php'); ?>					
				</div>
			</div>

			<div class="bottom-block"> </div>
			
			<footer class="footer">
				© 2016 Scott Huffman, All Rights Reserved
			</footer>
		</div><div class="left-border"></div>

	</body>

	<script>
		var scrolling = false;
		$('.portfolio-sidebar-list-item').click(function(ref){
			if(scrolling) return;
			scrolling = true;
			//console.log( $('.portfolio-sidebar-list-item') );

			//ref.addClass("");
			$('.portfolio-sidebar-list-item').removeClass('portfolio-sidebar-list-item-selected');

			var refItem = $("#" + ref.currentTarget.id + "-post");
			$("#" + ref.currentTarget.id).addClass("portfolio-sidebar-list-item-selected");

			ref.preventDefault();
			$('#portfolio-area').stop().animate({
				scrollTop: refItem.position().top //+ offset
			}, {duration: 800, complete: function(){
				scrolling = false;
			}});


		});

		$('.category-button').click(function() {
			$('.column-1').css({'height':'100px', 'width': 'calc(100% - 40px)'});
			$('.bottom-block').fadeIn(500);
			$('.content-area').fadeIn(500).css("display","table");
			$('.column-2').fadeOut(500, function(){ $('.title-bar-button').fadeIn(500).css("display","inline-block"); });
		});

		$('#blog').click(function() {
			$('#portfolio-area').fadeOut(250, function(){$('#blog-area').fadeIn(250);});
			
			$('#blog').addClass('category-button-selected');
			$('#portfolio').removeClass('category-button-selected');

			var stateObject = {};
			//window.history.pushState(stateObject, "Blog", "/?blog");
			console.log(stateObject);
		});

		$('#portfolio').click(function() {
			$('#blog-area').fadeOut(250, function(){$('#portfolio-area').fadeIn(250);});
			
			$('#blog').removeClass('category-button-selected');
			$('#portfolio').addClass('category-button-selected');

			var stateObject = {};
			//window.history.pushState(stateObject, "Portfolio", "/?portfolio");
		});

		$('#blogPanel').click(function() {
			$('#portfolio-area').fadeOut(250, function(){$('#blog-area').fadeIn(250);});
			
			$('#blog').addClass('category-button-selected');
			$('#blogPanel').addClass('category-button-selected');
			$('#portfolio').removeClass('category-button-selected');

			var stateObject = {};
			//window.history.pushState(stateObject, "Blog", "/?blog");

		});

		$('#portfolioPanel').click(function() {
			$('#blog-area').fadeOut(250, function(){$('#portfolio-area').fadeIn(250);});
			$('#blog').removeClass('category-button-selected');
			$('#portfolio').addClass('category-button-selected');
			$('#portfolioPanel').addClass('category-button-selected');

			var stateObject = {};
			//window.history.pushState(stateObject, "Portfolio", "/?portfolio");


		});

		//$('.content-list').scroll(function() {

		//});

	</script>

</html>