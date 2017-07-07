<?php
//posts.php

function processLinks($postFile){
	require_once($postFile);

	$firstPost = true;

	foreach ($posts as $post) :
		?>
		<a class="full-post <?php if ($firstPost) { echo "first-post"; $firstPost = false; }?>" id = "<?php echo $post['id'].'-post'; ?>" style="background: url('<?php echo $post['icon'] ?>') center center no-repeat;" target="_blank" href = "<?php echo $post['url'];?>">
			<div class="darkener">
			</div>
			<div class="post-link-wrap">
				<div class="post-link arrow" style="transform:rotate(180deg);">
					<div class="arrow-tail"></div>
					<div class="arrow-head">
						<div class="arrow-top-point">
							<div class="arrow-point-size"></div>
						</div>
						<div class="arrow-bottom-point"> 
							<div class="arrow-point-size"></div>
						</div>
					</div>
				</div>

			</div>
			<div class="post-title-wrap">
				<h4 class = "post-title"><?php echo $post['title']; ?></h4>
				<h5 class = "post-subtitle"><?php
					if( isset($post['subtitle']) ){
						echo $post['subtitle']; 
					}
					else {
						echo $post['url'];
					}
				?></h5>
			</div>
		</a>
	<?php endforeach;?>

	<div class="portfolio-sidebar">

<!--
		<div class="up-arrow arrow" style="transform:rotate(90deg);">
			<div class="arrow-tail"></div>
			<div class="arrow-head">
				<div class="arrow-top-point">
					<div class="arrow-point-size"></div>
				</div>
				<div class="arrow-bottom-point"> 
					<div class="arrow-point-size"></div>
				</div>
			</div>
		</div>-->

		<ul class = "portfolio-sidebar-list"><?php
			$firstPost = true;
			foreach ($posts as $post) {
				if($firstPost){
					echo '<li class ="portfolio-sidebar-list-item portfolio-sidebar-list-item-selected" id = "'.$post['id'].'"><span class="portfolio-sidebar-list-item-sub">' . $post['title'] . "</span></li>";
					$firstPost = false;
					continue;
				}
				echo '<li class ="portfolio-sidebar-list-item" id = "'.$post['id'].'"><span class="portfolio-sidebar-list-item-sub">' . $post['title'] . "</span></li>";
			}
		?></ul>

		<!--<div class="down-arrow arrow" style="transform:rotate(-90deg);">
			<div class="arrow-tail"></div>
			<div class="arrow-head">
				<div class="arrow-top-point">
					<div class="arrow-point-size"></div>
				</div>
				<div class="arrow-bottom-point"> 
					<div class="arrow-point-size"></div>
				</div>
			</div>
		</div>-->
	</div>

<?php
}

function processPosts($postFile){
	require_once($postFile);
	$postQty = 1;
	//$subQty = 0;

	//$firstPost = true;


	foreach ($posts as $post) :
		?><a class="blog-post full-post <?php if ( $postQty < 3) { echo "first-post "; } echo postRowQty($postQty); ?>" style="background: url('<?php echo $post['icon'] ?>') center center no-repeat;" target="_blank" href = "<?php echo $post['url'];?>">
			<div class="darkener">
			</div>
			<div class="post-link-wrap">
				<div class="post-link arrow" style="transform:rotate(180deg);">
					<div class="arrow-tail"></div>
					<div class="arrow-head">
						<div class="arrow-top-point">
							<div class="arrow-point-size"></div>
						</div>
						<div class="arrow-bottom-point"> 
							<div class="arrow-point-size"></div>
						</div>
					</div>
				</div>

			</div>
			<div class="post-title-wrap">
				<h4 class = "post-title"><?php echo $post['title']; ?></h4>
				<h5 class = "post-subtitle"></h5>
			</div>
		</a><?php endforeach;
	return;
	return;

	foreach ($posts as $post) :?><div class="<?php echo postRowQty($postQty) ?>">
			<h4 class = "post-title">
				<?php echo $post['title'];?>
			</h4>
			
			<?php if($post['icon']): ?>
				<img src= <?php echo '"'.$post['icon'].'"'; ?> alt="icon" class="post-image">
			<?php endif; ?>
			<!--<div class="post-preview"> <?php //echo $post['preview']; ?> </div>-->
		</div><?php endforeach;
}

function postRowQty(&$postQty){
	if($postQty++%2 === 0 )
		return 'second-post';
	return '';

	return 'post';
	$output = 'post ';
	if($postQty === 1){
		$postQty = 3;
		$output .= 'full-post';
	}
	else if($postQty === 2){
		$subQty++;
		$output .= 'half-post';
	}
	else if($postQty === 3){
		$subQty++;
		$output .= 'third-post';
	}
	if($postQty === $subQty){
		if( $postQty === 3){
			$postQty = 2;
			$subQty = 0;
		}
		else{
			$postQty = 3;
			$subQty = 0;
		}
	}
	return $output;
}

?>