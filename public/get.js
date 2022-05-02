fetch("data.json")
    .then(Response => Response.json())
    .then(data => {
		for (let item of data) {
			let newAlbum = document.createElement("div");
			newAlbum.className = "album";

			let title = document.createElement("h2");
			title.className = "title";
			title.innerText = item.album.name;
			newAlbum.appendChild(title);

			let year = document.createElement("h3");
			year.className = "year";
			year.innerText = item.album.release_date;
			newAlbum.appendChild(year);
			
			let artists = document.createElement("div");
			artists.className = "artists";
			item.album.artists.map(artist =>
				{	
					let name = document.createElement("p");
					name.className = "name";
					name.innerText = artist.name;
					artists.appendChild(name);
				}
			);
			newAlbum.appendChild(artists);
			
			let cover_div = document.createElement("div");
			cover_div.className = "cover-div";
			let img = document.createElement("img");
			img.className = "cover";
			img.src = item.album.images[0].url;
			cover_div.appendChild(img);
			newAlbum.appendChild(cover_div);
			
			let tracks = document.createElement("ol");
			tracks.className = "tracks";
			item.album.tracks.items.map(track =>
				{
					let name = document.createElement("li");
					name.className = "track";
					name.innerText = track.name;
					tracks.appendChild(name);
				}
			);
			newAlbum.appendChild(tracks);
			
			let line = document.createElement("hr");
			newAlbum.appendChild(line);
			

			document.body.appendChild(newAlbum);
			
		}
    });
	